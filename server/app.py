from flask import Flask,make_response,jsonify,request,session
from flask_migrate import Migrate
from flask_restful import Api,Resource
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime
from models import db,BlogPost,Category,Comment,Media,User
from flask_bcrypt import Bcrypt
import os



app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate=Migrate(app,db)
bcrypt = Bcrypt(app)
db.init_app(app)
CORS(app)


api=Api(app)
ma=Marshmallow(app)
ma.init_app(app)

class Blog_post_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=BlogPost
        include_fk = True
class User_Schema(SQLAlchemyAutoSchema):
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

@app.before_request
def check_if_logged_in():
    allowed_endpoints = ['blog_list', 'blog_list_id', 'user_list', 'category_list', 'category_list_id']
    
    if 'user_id' not in session and request.endpoint not in allowed_endpoints:
        return jsonify({'error': 'Unauthorized'}), 401




class Login(Resource):
    def post(self):
        user = User.query.filter(
            User.username == request.get_json()['username']
        ).first()
        if user:
            session['user_id'] = user.id  
            result = user_schema.dump(user)
            return jsonify(result), 201 

api.add_resource(Login, '/login')

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            result = user_schema.dump(user)
            return jsonify(result), 200 
        else:
            return jsonify({'message': '401: Not Authorized'}), 401

api.add_resource(CheckSession, '/check_session')

class Logout(Resource):
    def get(self):
        session['user_id'] = None
        return jsonify({'message': '204: No Content'}), 204

api.add_resource(Logout, '/logout')





class Blog(Resource):
    def get(self):
        blogs=BlogPost.query.all()
        result=blog_schema.dump(blogs, many=True)
        return make_response(jsonify(result),200)
    def post(self):
        data=request.get_json()
        new_blog=BlogPost(
            title=data["title"],
            content=data["content"],
            pub_date=datetime.utcnow(),
            user_id=data["user_id"],
        )
        db.session.add(new_blog)
        db.session.commit()
        result=blog_schema.dump(new_blog)
        return make_response(jsonify(result),201)

api.add_resource(Blog,'/blogs', endpoint='blog_list')

class BlogById(Resource):
    def get(self,id):
        single_blog=BlogPost.query.filter_by(id=id).first()
        if  not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body,404)
        else:
            result=blog_schema.dump(single_blog)
            return make_response(jsonify(result),200)
    def patch(self, id):
        data = request.get_json()
        single_blog = BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body, 404)
        else:
            title = data["title"]
            content=data['content']
            single_blog.title =title
            single_blog.content=content
            result = blog_schema.dump(single_blog)
            db.session.commit()
        return make_response(jsonify(result), 201)
            
    def delete(self,id):
        single_blog=BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body,404)
        else:
             Comment.query.filter_by(post_id=id).delete()
             Media.query.filter_by(post_id=id).delete()

             db.session.delete(single_blog)
             db.session.commit()
             response_body={"message":" blog successfully deleted"}
             return make_response(response_body,204)

        
            
api.add_resource(BlogById,"/blogs/<int:id>,",endpoint='blog_list_id')

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
        data=request.get_json()
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
        data=request.get_json()
        user=User.query.filter_by(id=id).first()
        if not user:
            response_body = {"error": "user not found"}
            return make_response(response_body,404)
        else:
            profile_image = data["profile_image"]
            password=data["password"]
            user.password=data["password"]
            user.profile_image = profile_image
            db.session.commit()
            result = user_schema.dump(user)
            return make_response(jsonify(result), 201)

api.add_resource(UserById, "/users/<int:id>",endpoint='user_list')

class Categories(Resource):
    def get(self):
        categories = Category.query.all()
        result = category_schema.dump(categories, many=True)
        return make_response(jsonify(result), 200)

    def post(self):
        data = request.get_json()
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

api.add_resource(Categories, "/categories",endpoint='category_list')

class CategoryById(Resource):
    def get(self, id):
        category = Category.query.filter_by(id=id).first()
        result = category_schema.dump(category)
        return make_response(jsonify(result), 200)

    def patch(self, id):
        data = request.get_json()
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

api.add_resource(CategoryById, "/categories/<int:id>,",endpoint='category_list_id')

class Comments(Resource):
    def get(self):
        comments=Comment.query.all()
        result=comment_schema.dump(comments, many=True)
        return make_response(jsonify(result),200)
    def post(self):
        data=request.get_json()
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
    def get(self,id):
        single_comment=Comment.query.filter_by(id=id).first()
        result=comment_schema.dump(single_comment)
        return make_response(jsonify(result),200)
    def patch(self,id):
        data=request.get_json()
        single_comment=Comment.query.filter_by(id=id).first()
        if not single_comment:
            response_body = {"error": "Comment not found"}
            return make_response(response_body, 404)
        else:
            single_comment.content=data["content"]
            result=comment_schema.dump(single_comment)
            return make_response(jsonify(result),201)
    def delete(self,id):
        single_comment=Comment.query.filter_by(id=id).first()
        if not single_comment:
            response_body = {"error": "Comment not found"}
            return make_response(response_body, 404)
        else:
            db.session.delete(single_comment)
            db.session.commit()
            response_body = {"message": "comment successfully deleted"}
            return make_response(jsonify(response_body), 204)
api.add_resource(CommentById, "/comments/<int:id>")









    


        








if __name__=='__main__':
    app.run(port=5555)
