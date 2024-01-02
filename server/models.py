from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.String(255))
    blogs = db.relationship('BlogPost', backref='user_blog')
    comments = db.relationship('Comment', backref='user_comment')

    def __repr__(self):
        return f"<User {self.username}>"


class BlogPost(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    pub_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comments = db.relationship('Comment', backref='post_comment')
    images = db.relationship('Media', backref='post_image')
    categories = db.relationship('Category', secondary='blogs_categories', back_populates='posts')

    
    def __repr__(self):
        return f"<Blog {self.title}>"


class Media(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)

    def __repr__(self):
        return f"<image {self.file_path}>"

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    guest_name = db.Column(db.String(100))
    is_guest = db.Column(db.Boolean, default=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Comment {self.id} by {self.user.username if self.user else self.guest_name}>"

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    posts = db.relationship('BlogPost', secondary='blogs_categories', back_populates='categories')

    def __repr__(self):
        return f"<Category {self.name}>"

blogs_categories = db.Table(
    'blogs_categories',
    db.Column('blog_id', db.ForeignKey('posts.id'), primary_key=True),
    db.Column('category_id', db.ForeignKey('categories.id'), primary_key=True),
    extend_existing=True
)
