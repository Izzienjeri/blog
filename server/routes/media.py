from cloudinary.uploader import upload
import os
from datetime import datetime
from flask import Blueprint,request,make_response,jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse,abort
from flask_jwt_extended import jwt_required,get_jwt_identity,current_user
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import cross_origin
from models import db,User,BlogPost,Comment,Category,Media,blogs_categories
from serializer import media_schema,user_schema

media_bp=Blueprint('media_blueprint',__name__)
ma=Marshmallow(media_bp)
api=Api(media_bp)


add_image_parser=reqparse.RequestParser()
add_image_parser.add_argument('file_path', type=str, required=True, help='Filepath cannot be blank')
add_image_parser.add_argument('description', type=str)
add_image_parser.add_argument('post_id', type=int, required=True, help='Post Id cannot be blank')

class FileUpload(Resource):
    @cross_origin()
    @jwt_required()
    def post(self, id):
        if 'file' not in request.files:
            return make_response(jsonify({"error": "No file part"}), 400)
        file = request.files['file']
        if file.filename == '':
            return make_response(jsonify({"error": "No selected file"}), 400)

        try:
           
            cloudinary_upload_result = upload(file)

            
            image_url = cloudinary_upload_result.get("url")
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
      
     
        
api.add_resource(FileUpload, "/upload/<int:id>")

   

class ProfileImageUpload(Resource):
    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        if 'file' not in request.files:
            return make_response(jsonify({"error": "No file part"}), 400)
        file = request.files['file']
        if file.filename == '':
            return make_response(jsonify({"error": "No selected file"}), 400)

        try:
            cloudinary_upload_result = upload(file)
            image_url = cloudinary_upload_result.get("url")
            print(image_url)

            current_user = User.query.get(user_id)  

            if current_user:
                current_user.profile_image = image_url

                db.session.commit()

                result = user_schema.dump(current_user.profile_image)
                return make_response(jsonify(result), 201)
            else:
                return make_response(jsonify({"error": "User not found"}), 404)

        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(ProfileImageUpload, "/upload_profileImage")
