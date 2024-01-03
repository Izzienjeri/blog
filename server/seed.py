from models import Category,Comment,Media,BlogPost,User,blogs_categories
from datetime import datetime
from app import app
from models import db

def seed_database():
  with app.app_context():
    Category.query.delete()
    Comment.query.delete()
    Media.query.delete()
    BlogPost.query.delete()
    User.query.delete()
    db.session.query(blogs_categories).delete()
    db.create_all()

    user_data=[
        {
            "id": 1,
            "username": "john_doe",
            "email": "john.doe@example.com",
            "password": "hashed_password_1",
            "profile_image": "profile1.jpg"
        },
        {
            "id": 2,
            "username": "jane_smith",
            "email": "jane.smith@example.com",
            "password": "hashed_password_2",
            "profile_image": "profile2.jpg"
        },
        {
            "id": 3,
            "username": "alice_jones",
            "email": "alice.jones@example.com",
            "password": "hashed_password_3",
            "profile_image": "profile3.jpg"
        },
    
    ]

    for user in user_data:
        new_user=User(**user)
        db.session.add(new_user)
        db.session.commit()
  
    blog_post_data=[
        {
            "id": 1,
            "title": "Unraveling the Neural Networks",
            "content": "Exploring the intricate details of neural networks and their applications.",
            "pub_date": datetime.utcnow(),
            "user_id": 1
        },
        {
            "id": 2,
            "title": "Cognitive Machines at Work",
            "content": "Diving into the world of cognitive computing and how machines mimic human thought processes.",
            "pub_date": datetime.utcnow(),
            "user_id": 2
        },
        {
            "id": 3,
            "title": "The Quantum Leap in AI",
            "content": "Understanding the potential impact of quantum computing on the field of artificial intelligence.",
            "pub_date": datetime.utcnow(),
            "user_id": 1
        },
        {
            "id": 4,
            "title": "Revolutionizing Tech with AI",
            "content": "Exploring how artificial intelligence is reshaping various industries and technological landscapes.",
            "pub_date": datetime.utcnow(),
            "user_id": 3
        },
        {
            "id": 5,
            "title": "The AI Odyssey Continues",
            "content": "Navigating the latest advancements and breakthroughs in the ever-evolving world of artificial intelligence.",
            "pub_date": datetime.utcnow(),
            "user_id": 2
        },
    ]

    for post in blog_post_data:
            new_blog=BlogPost(**post)
            db.session.add(new_blog)
            db.session.commit()

    image_data=[
        {
            "id": 1,
            "file_path": "https://example.com/image1.jpg",
            "description": "Beautiful sunset",
            "post_id": 1
        },
        {
            "id": 2,
            "file_path": "https://example.com/image2.jpg",
            "description": "City skyline",
            "post_id": 1
        },
        {
            "id": 3,
            "file_path": "https://example.com/image3.jpg",
            "description": "Nature landscape",
            "post_id": 2
        },
        {
            "id": 4,
            "file_path": "https://example.com/image4.jpg",
            "description": "Adventurous mountain climb",
            "post_id": 2
        },
        {
            "id": 5,
            "file_path": "https://example.com/image5.jpg",
            "description": "Cozy cabin in the woods",
            "post_id": 3
        },
    
    ]
    for image in image_data:
        new_image=Media(**image)
        db.session.add(new_image)
        db.session.commit()

    comment_data=[
        {
            "id": 1,
            "content": "This is the first comment.",
            "user_id": 1,
            "guest_name": "Guest123",
            "is_guest": False,
            "post_id": 1,
            "created_at": datetime.utcnow()
        },
        {
            "id": 2,
            "content": "Great post! Thanks for sharing.",
            "user_id": 2,
            "guest_name": None,
            "is_guest": False,
            "post_id": 1,
            "created_at": datetime.utcnow()
        },
        {
            "id": 3,
            "content": "Interesting topic. I'd love to learn more.",
            "user_id": None,
            "guest_name": "Visitor456",
            "is_guest": True,
            "post_id": 2,
            "created_at": datetime.utcnow()
        },
        {
            "id": 4,
            "content": "Nice work on this article!",
            "user_id": 3,
            "guest_name": None,
            "is_guest": False,
            "post_id": 2,
            "created_at": datetime.utcnow()
        },
        {
            "id": 5,
            "content": "I have a question about the third paragraph.",
            "user_id": 1,
            "guest_name": None,
            "is_guest": False,
            "post_id": 3,
            "created_at": datetime.utcnow()
        },
    
    ]
    for comment in comment_data:
        new_comment=Comment(**comment)
        db.session.add(new_comment)
        db.session.commit()

    category_data=[
        {
            "id": 1,
            "name": "ML Basics",
            "description": "Introduction to fundamental concepts in machine learning.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 2,
            "name": "NLP",
            "description": "Exploring techniques for processing and understanding human language.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 3,
            "name": "Computer Vision",
            "description": "Understanding and interpreting visual information by computers.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 4,
            "name": "Reinforcement Learning",
            "description": "Learning through trial and error, with a focus on decision-making.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": 5,
            "name": "Neural Networks",
            "description": "In-depth exploration of artificial neural networks and deep learning models.",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

    ]
    for category in category_data:
        new_category=Category(**category)
        db.session.add(new_category)
        db.session.commit()

    blogs_categories_data=[
        {
            "blog_id": 1,
            "category_id": 3,
        },
        {
            "blog_id": 2,
            "category_id": 1,
        },
        {
            "blog_id": 3,
            "category_id": 5,
        },
        {
            "blog_id": 4,
            "category_id": 2,
        },
        {
            "blog_id": 5,
            "category_id": 4,
        },
    ]

    for entry in blogs_categories_data:
        blog_post = db.session.query(BlogPost).filter_by(id=entry["blog_id"]).first()
        single_category = db.session.query(Category).filter_by(id=entry["category_id"]).first()
        blog_post.categories.append(single_category)
        db.session.commit()

        

if __name__=="__main__":
  seed_database()
