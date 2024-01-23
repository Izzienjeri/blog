
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
from serializer import category_schema



from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models import db,User,BlogPost,Comment,Category,Media,blogs_categories

category_bp=Blueprint('category_blueprint',__name__)
ma=Marshmallow(category_bp)
api=Api(category_bp)

add_category_parser=reqparse.RequestParser()
add_category_parser.add_argument('new_category',type=str,required=True, help='Category Name cannot be blank')
add_category_parser.add_argument('description',type=str,required=True, help='Description cannot be blank')


update_category_parser=reqparse.RequestParser()
update_category_parser.add_argument('name',type=str)
update_category_parser.add_argument('description',type=str)

class Categories(Resource):
    def get(self):
        categories = Category.query.all()
        result = category_schema.dump(categories, many=True)
        return make_response(jsonify(result), 200)

    def post(self):
        data = add_category_parser.parse_args()
        new_category = Category(
            name=data["new_category"],
            description=data["description"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
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
