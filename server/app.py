from flask import Flask,make_response,jsonify,request
from flask_migrate import Migrate
from flask_restful import Api,Resource
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime
from models import db,BlogPost,Category,Comment,Media,User
import os



app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate=Migrate(app,db)
db.init_app(app)
CORS(app)

api=Api(app)
ma=Marshmallow(app)
ma.init_app(app)

class Blog_post_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=BlogPost
class User_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=User
class Comment_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=Comment
class Media_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=Media
class Category_Schema(SQLAlchemyAutoSchema):
    class Meta:
        model=Category
blog_schema=Blog_post_Schema()
user_schema=User_Schema()
comment_schema=Comment_Schema()
media_schema=Media_Schema()
category_schema=Category_Schema()

@app.route("/")
def home_page():
    return "Welcome to the AI Blog app"

class Blog(Resource):
    def get(self):
        blogs=BlogPost.query.all()
        result=blog_schema.dump(blogs,many=True)
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
        return make_response(jsonify,(result),201)

api.add_resource(Blog,'/blogs')

class BlogById(Resource):
    def get(self,id):
        single_blog=BlogPost.query.filter_by(id=id).first()
        if  not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body,404)
        else:
            result=blog_schema.dump(single_blog)
            return make_response(jsonify(result),200)
    def patch(self,id):
        data=request.get_json()
        single_blog=BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body,404)
        else:
            for attr in data:
                setattr(single_blog,attr,data[attr])
                result=blog_schema.dump(single_blog)
                db.session.commit()
                return make_response(jsonify(result), 201)

            
    def delete(self,id):
        single_blog=BlogPost.query.filter_by(id=id).first()
        if not single_blog:
            response_body = {"error": "blog not found"}
            return make_response(response_body,404)
        else:
             single_blog.delete()
             db.session.commit()
             response_body={"message":" blog successfully deleted"}
             return make_response(response_body,204)

        
            
api.add_resource(BlogById,"/blogs/<int:id>")

class User(Resource):
    def get(self):
        users=User.query.all()
        result=user_schema.dump(users,many=True)
        return make_response(jsonify(result),200)
    
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
api.add_resource(User,"/user")

    
class UserById(Resource):
    def get(self,id):
        user=User.query().filter_by(id=id).first()
        result=user_schema.dump(user)
        return make_response(result,200)
    def patch(self,id):
        data=request.get_json()
        user=User.query().filter_by(id=id).first()
        if not user:
            response_body = {"error": "user not found"}
            return make_response(response_body,404)
        else:
            profile_image = data["profile_image"]
            user.profile_image = profile_image
            db.session.commit()
            result = user_schema.dump(user)
            return make_response(jsonify(result), 201)

api.add_resource(UserById, "/user/<int:id>")

class Category(Resource):
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

api.add_resource(Category, "/category")

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
            for attr in data:
                setattr(category, attr, data[attr])

            result = category_schema.dump(category)
            db.session.commit()
            return make_response(jsonify(result), 201)

    def delete(self, id):
        category = Category.query.filter_by(id=id).first()
        if not category:
            response_body = {"error": "category not found"}
            return make_response(response_body, 404)
        else:
            category.delete()
            db.session.commit()
            response_body = {"message": "category successfully deleted"}
            return make_response(jsonify(response_body), 204)

api.add_resource(CategoryById, "/category/<int:id>")


        








if __name__=='__main__':
    app.run(port=5555)
