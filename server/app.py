from flask import Flask, make_response, jsonify, request, session
from flask_migrate import Migrate
from flask_restful import Api, Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS,cross_origin
import cloudinary.uploader

from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime
from flask_bcrypt import Bcrypt
from werkzeug.datastructures import FileStorage

import secrets
import cloudinary
from models import db, BlogPost, Category, Comment, Media, User
from dotenv import load_dotenv
import os


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_hex(16)

load_dotenv()
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
db.init_app(app)
CORS(app)
api = Api(app)
ma = Marshmallow(app)


load_dotenv()

cloudinary_url = os.getenv('CLOUDINARY_URL')
cloudinary_cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
cloudinary_api_key = os.getenv('CLOUDINARY_API_KEY')
cloudinary_api_secret = os.getenv('CLOUDINARY_API_SECRET')

app.config['CLOUDINARY_URL'] = cloudinary_url
app.config['CLOUDINARY_CLOUD_NAME'] = cloudinary_cloud_name
app.config['CLOUDINARY_API_KEY'] = cloudinary_api_key
app.config['CLOUDINARY_API_SECRET'] = cloudinary_api_secret





add_post_parser=reqparse.RequestParser()
add_post_parser.add_argument('title', type=str, required=True, help='Title cannot be blank')
add_post_parser.add_argument('content', type=str, required=True, help='Content cannot be blank')
add_post_parser.add_argument('excerpt', type=str, required=True, help='Excerpt cannot be blank')

add_image_parser=reqparse.RequestParser()
add_image_parser.add_argument('file_path', type=str, required=True, help='Filepath cannot be blank')
add_image_parser.add_argument('description', type=str)
add_image_parser.add_argument('post_id', type=int, required=True, help='Post Id cannot be blank')


update_post_parser = reqparse.RequestParser()
update_post_parser.add_argument('title', type=str)
update_post_parser.add_argument('content', type=str)
update_post_parser.add_argument('excerpt', type=str)

add_user_parser=reqparse.RequestParser()
add_user_parser.add_argument('username',type=str,required=True, help='Username cannot be blank')
add_user_parser.add_argument('email',type=str,required=True, help='Email cannot be blank')
add_user_parser.add_argument('password',type=str,required=True, help='Password cannot be blank')

update_user_parser=reqparse.RequestParser()
update_user_parser.add_argument('username',type=str)
update_user_parser.add_argument('email',type=str)
update_user_parser.add_argument('password',type=str)

add_category_parser=reqparse.RequestParser()
add_category_parser.add_argument('name',type=str,required=True, help='Category Name cannot be blank')
add_category_parser.add_argument('description',type=str,required=True, help='Description cannot be blank')


update_category_parser=reqparse.RequestParser()
update_category_parser.add_argument('name',type=str)
update_category_parser.add_argument('description',type=str)

add_comment_parser=reqparse.RequestParser()
add_comment_parser.add_argument('content',type=str,required=True, help='Comment cannot be blank')

update_comment_parser=reqparse.RequestParser()
update_comment_parser.add_argument('content',type=str)







class Blog_post_Schema(SQLAlchemyAutoSchema):
    comment=ma.Nested('Comment_Schema',many=True)
    images=ma.Nested('Media_Schema',many=True)
    class Meta:
        model=BlogPost
            
        include_fk = True

class User_Schema(SQLAlchemyAutoSchema):
    blog=ma.Nested('Blog_post_Schema')
    class Meta:
        model=User
        
       
class Comment_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=Comment
        include_fk = True
class Media_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=Media
       
class Category_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=Category


      
blog_schema = Blog_post_Schema()
user_schema=User_Schema()
comment_schema=Comment_Schema()
media_schema=Media_Schema()
category_schema=Category_Schema()


@app.route("/")
def home_page():
    return "Welcome to the AI Blog app"


class Login(Resource):
    def post(self):
        user = User.query.filter(
            User.username == request.get_json()['username']
        ).first()
        
        if user:
            session['user_id'] = user.id  
            result = user_schema.dump(user)
            return make_response(jsonify(result), 201 ) 
        else:
            response_body = {"message": "Invalid username or password."}
            return make_response(response_body, 404)
           
api.add_resource(Login, '/login')




class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            result = user_schema.dump(user)
            return make_response(jsonify(result), 200 )
        else:
            response_body = {"message": "401: Not Authorized"}
            return make_response(response_body, 401)

api.add_resource(CheckSession, '/check_session')

class Logout(Resource):
    def get(self):
        session['user_id'] = None
        response_body = {'message': '204: No Content'}
        return make_response(response_body, 204)

api.add_resource(Logout, '/logout')






class Blog(Resource):
    def get(self):
        blogs = BlogPost.query.all()
        result = blog_schema.dump(blogs, many=True)
        return make_response(jsonify(result), 200)

    def post(self):
        data = add_post_parser.parse_args()
        title = data["title"]
        content = data["content"]
        excerpt = data["excerpt"]

        user_id = session.get("user_id")

        if 'image' in request.files:
            uploaded_file = request.files['image']
            result = cloudinary.uploader.upload(uploaded_file)
            image_url = result['url']
        else:
            image_url = None

        new_blog = BlogPost(title=title, content=content, excerpt=excerpt, pub_date=datetime.utcnow(), user_id=user_id)

        if image_url:
            new_image = Media(file_path=image_url)
            new_blog.images.append(new_image)
            db.session.add(new_image)

        db.session.add(new_blog)
        db.session.commit()

       
        if image_url:
            new_image.file_path = image_url
            db.session.commit()

        result = blog_schema.dump(new_blog)
        return make_response(jsonify(result), 201)


api.add_resource(Blog,'/blogs')

class BlogById(Resource):
    def get(self, id):
        single_blog = BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
            result = blog_schema.dump(single_blog)
            return make_response(jsonify(result), 200)

    def patch(self, id):
        data = update_post_parser.parse_args()
        single_blog = BlogPost.query.filter_by(id=id).first()

        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
           
            user_id = session.get("user_id")
            if single_blog.user_id != user_id:
                return jsonify({'error': 'Unauthorized'}), 401

            if data['title']:
                single_blog.title = data['title']
            if data['content']:
                single_blog.content = data['content']
            if data['excerpt']:
                single_blog.excerpt = data['excerpt']

            if 'image' in request.files:
                uploaded_file = request.files['image']
                result = cloudinary.uploader.upload(uploaded_file)
                image_url = result['url']

                if single_blog.images:
                    single_blog.images[0].file_path = image_url
                else:
                    new_image = Media(file_path=image_url)
                    single_blog.images.append(new_image)
                    db.session.add(new_image)

            result = blog_schema.dump(single_blog)
            db.session.commit()

            return make_response(jsonify(result), 201)

    def delete(self, id):
        single_blog = BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
           
            user_id = session.get("user_id")
            if single_blog.user_id != user_id:
                response_body = {"message": "401: Not Authorized"}
                return make_response(response_body, 401)


            Comment.query.filter_by(post_id=id).delete()
            Media.query.filter_by(post_id=id).delete()

            db.session.delete(single_blog)
            db.session.commit()
            response_body = {"message": "blog successfully deleted"}
            return make_response(response_body, 204)

api.add_resource(BlogById, "/blogs/<int:id>")


class Users(Resource):
    def get(self):
        users = User.query.all()
        result = []
        
        for user in users:
            user_data = user_schema.dump(user)
            user_info = {
                "username": user_data["username"],
                "email": user_data["email"],
                "profile_image": user_data["profile_image"]
            }
            result.append(user_info)

        return make_response(jsonify(result), 200)

    
    def post(self):
        data=add_user_parser.parse_args()

        new_user=User(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
        db.session.add(new_user)
        db.session.commit()
        result=user_schema.dump(new_user)
        return make_response(jsonify(result),201)
api.add_resource(Users,"/users")

    
class UserById(Resource):
    def get(self,id):
        user=User.query.filter_by(id=id).first()
        result=user_schema.dump(user)
        return make_response(result,200)
    def patch(self,id):
        data=update_user_parser.parse_args()
        user=User.query.filter_by(id=id).first()
        if not user:
            response_body = {"error": "user not found"}
            return make_response(response_body,404)
        else:
            profile_image = data["profile_image"]
        
            user.password=data["password"]
            user.profile_image = profile_image
            db.session.commit()
            result = user_schema.dump(user)
            return make_response(jsonify(result), 201)

api.add_resource(UserById, "/users/<int:id>")

class Categories(Resource):
    def get(self):
        categories = Category.query.all()
        result = category_schema.dump(categories, many=True)
        return make_response(jsonify(result), 200)

    def post(self):
        data = add_category_parser.parse_args()
        new_category = Category(
            name=data["name"],
            description=data["description"],
            created_at=datetime.utc(),
            updated_at=datetime.utc(),
        )
        db.session.add(new_category)
        db.session.commit()
        result = category_schema.dump(new_category)
        return make_response(jsonify(result), 201)

api.add_resource(Categories, "/categories")

class CategoryById(Resource):
    def get(self, id):
        category = Category.query.filter_by(id=id).first()
        result = category_schema.dump(category)
        return make_response(jsonify(result), 200)

    def patch(self, id):
        data = update_category_parser.parse_args()
        category = Category.query.filter_by(id=id).first()
        if not category:
            response_body = {"error": "category not found"}
            return make_response(response_body, 404)
        else:
            category.name = data["name"]
            category.description=data["description"]
            category.updated_at = datetime.utcnow()
            result = category_schema.dump(category)
            db.session.commit()
            return make_response(jsonify(result), 201)

    def delete(self, id):
        category = Category.query.filter_by(id=id).first()
        if not category:
            response_body = {"error": "category not found"}
            return make_response(response_body, 404)
        else:
            db.session.delete(category)
            db.session.commit()
            response_body = {"message": "category successfully deleted"}
            return make_response(jsonify(response_body), 204)

api.add_resource(CategoryById, "/categories/<int:id>")

class Comments(Resource):
    def get(self):
        comments=Comment.query.all()
        result=comment_schema.dump(comments, many=True)
        return make_response(jsonify(result),200)
    def post(self):
        data=add_comment_parser.parse_args()
        new_comment=Comment(
            content=data["content"],
            user_id=data["user_id"],
            guest_name=data["guest_name"],
            is_guest=data["is_guest"],
            post_id=data["post_id"],
            created_at=datetime.utcnow()

        )
        db.session.add(new_comment)
        db.session.commit()
        result=comment_schema.dump(new_comment)
        return make_response(jsonify(result),201)
    

api.add_resource(Comments, "/comments")

class CommentById(Resource):
    def get(self, id):
        single_comment = Comment.query.filter_by(id=id).first()
        result = comment_schema.dump(single_comment)
        return make_response(jsonify(result), 200)

    def patch(self, id):
        data = update_comment_parser.parse_args()
        single_comment = Comment.query.filter_by(id=id).first()

        if not single_comment:
            response_body = {"error": "Comment not found"}
            return make_response(response_body, 404)
        else:
           
            user_id = session.get("user_id")
            if single_comment.user_id != user_id:
                response_body = {"message": "401: Not Authorized"}
                return make_response(response_body, 401)


            single_comment.content = data["content"]
            result = comment_schema.dump(single_comment)
            db.session.commit()
            return make_response(jsonify(result), 201)

    def delete(self, id):
        single_comment = Comment.query.filter_by(id=id).first()

        if not single_comment:
            response_body = {"error": "Comment not found"}
            return make_response(response_body, 404)
        else:
           
            user_id = session.get("user_id")
            if single_comment.user_id != user_id:
                response_body = {"message": "401: Not Authorized"}
                return make_response(response_body, 401)


            db.session.delete(single_comment)
            db.session.commit()
            response_body = {"message": "comment successfully deleted"}
            return make_response(jsonify(response_body), 204)

api.add_resource(CommentById, "/comments/<int:id>")


@app.route("/upload/<int:id>", methods=['POST'])
@cross_origin()
def upload_file(id):
    app.logger.info('in upload route')

    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )

    upload_result = None

    if 'file' not in request.files:
        return make_response(jsonify({"error": "No file part"}), 400)

    file_to_upload = request.files['file']

    if file_to_upload.filename == '':
        return make_response(jsonify({"error": "No selected file"}), 400)

    app.logger.info('%s file_to_upload', file_to_upload)

    try:
        upload_result = cloudinary.uploader.upload(file_to_upload)
        image_url = upload_result.get("url")
        print(image_url)

        data = request.form  

        new_image = Media(
            file_path=image_url,
            description=data["description"],
            post_id=id,
        )

        db.session.add(new_image)
        db.session.commit()

        result = media_schema.dump(new_image)
        return make_response(jsonify(result), 201)

    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)
   

   


class CheckEmail(Resource):
    def get(self):
        email = request.args.get('email')
        user = User.query.filter(User.email == email).first()
        response_body = {"exists": user is not None}
        return make_response(response_body, 401)


api.add_resource(CheckEmail, '/check-email')





    


        








if __name__=='__main__':
    app.run(port=5555, debug=True)
