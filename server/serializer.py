from cloudinary.uploader import upload
import os
from datetime import datetime
from flask import Blueprint,request,make_response,jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse,abort
from flask_jwt_extended import jwt_required,get_jwt_identity,current_user
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import cross_origin
from werkzeug.datastructures import FileStorage



from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models import db,User,BlogPost,Comment,Category,Media,blogs_categories

serializer_bp=Blueprint('serializer_blueprint',__name__)
ma=Marshmallow(serializer_bp)
api=Api(serializer_bp)


class Blog_post_Schema(SQLAlchemyAutoSchema):
    comments=ma.Nested('Comment_Schema',many=True)
    images=ma.Nested('Media_Schema',many=True)
    categories = ma.Nested('Category_Schema', many=True)
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