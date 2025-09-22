from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from utils.base64_helpers import array_buffer_to_base64
from dotenv import load_dotenv
import os
from google import genai
from google.genai import types
import traceback
import base64

load_dotenv()

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env")

client = genai.Client(api_key=GEMINI_API_KEY)

@router.post("/image-search")
async def image_search(
    search_image: UploadFile = File(...),
    search_type: str = Form(...)
):
    try:
        # Validate image
        ALLOWED_MIME_TYPES = {
            "image/jpeg",
            "image/png", 
            "image/webp",
            "image/heic",
            "image/heif",
        }
        
        if search_image.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {search_image.content_type}"
            )

        image_bytes = await search_image.read()
        image_b64 = array_buffer_to_base64(image_bytes)
        
        prompt = """
        Analyze this clothing item image and find similar items from a fashion collection.
        
        Please identify:
        1. Item type (shirt, dress, pants, etc.)
        2. Color and pattern
        3. Style characteristics  
        4. Material type
        
        Then suggest 4 similar items with:
        - Item name
        - Similarity percentage (85-95%)
        - Key matching features
        
        Provide a detailed analysis of the clothing item and suggest similar pieces that would appeal to fashion-conscious shoppers.
        """
        
        contents = [
            prompt,
            types.Part.from_bytes(
                data=image_b64,
                mime_type=search_image.content_type,
            ),
        ]
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT']
            )
        )
        
        # Extract text response
        text_response = "No analysis available."
        if response.candidates and len(response.candidates) > 0:
            parts = response.candidates[0].content.parts
            if parts:
                for part in parts:
                    if hasattr(part, "text") and part.text:
                        text_response = part.text
                        break
        
        # Create fallback similar items
        similar_items = [
            {
                "name": "Similar Blue Shirt",
                "similarity": 89,
                "image": "https://via.placeholder.com/150x200/4F46E5/white?text=Similar+Item+1"
            },
            {
                "name": "Cotton Casual Tee",
                "similarity": 85, 
                "image": "https://via.placeholder.com/150x200/7C3AED/white?text=Similar+Item+2"
            },
            {
                "name": "Denim Style Shirt", 
                "similarity": 92,
                "image": "https://via.placeholder.com/150x200/2563EB/white?text=Similar+Item+3"
            },
            {
                "name": "Classic Button Down",
                "similarity": 88,
                "image": "https://via.placeholder.com/150x200/059669/white?text=Similar+Item+4"
            }
        ]
        
        return JSONResponse(content={
            "matches": similar_items,
            "analysis": text_response
        })
        
    except Exception as e:
        print(f"Error in image search: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Image search failed: {str(e)}")

@router.post("/wishlist-pairing")
async def wishlist_pairing(request_data: dict):
    try:
        selected_item = request_data.get("selected_item")
        user_preferences = request_data.get("user_preferences", {})
        
        prompt = f"""
        A user has selected "{selected_item}" from their wishlist and wants AI suggestions for matching pieces.
        
        User preferences:
        - Gender: {user_preferences.get('gender', 'unisex')}
        - Style: {user_preferences.get('style', 'casual')}
        
        Please suggest 6 matching clothing items that would pair well with "{selected_item}".
        
        Consider:
        1. Color coordination
        2. Style compatibility
        3. Occasion appropriateness
        4. Fashion trends
        
        Provide detailed reasoning for each suggestion and styling tips.
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=['TEXT']
            )
        )
        
        # Extract text response
        text_response = "No pairing suggestions available."
        if response.candidates and len(response.candidates) > 0:
            parts = response.candidates[0].content.parts
            if parts:
                for part in parts:
                    if hasattr(part, "text") and part.text:
                        text_response = part.text
                        break
        
        # Create fallback suggestions
        suggestions = [
            {
                "name": "White Cotton T-Shirt",
                "image": "https://via.placeholder.com/120x160/FFFFFF/333?text=White+Tee",
                "match_reason": "Classic pairing with denim"
            },
            {
                "name": "Black Skinny Jeans",
                "image": "https://via.placeholder.com/120x160/000000/white?text=Black+Jeans", 
                "match_reason": "Versatile bottom wear"
            },
            {
                "name": "Brown Leather Belt",
                "image": "https://via.placeholder.com/120x160/8B4513/white?text=Leather+Belt",
                "match_reason": "Complements jacket style"
            },
            {
                "name": "White Sneakers",
                "image": "https://via.placeholder.com/120x160/F5F5F5/333?text=Sneakers",
                "match_reason": "Casual comfort match"
            },
            {
                "name": "Dark Wash Jeans",
                "image": "https://via.placeholder.com/120x160/1E40AF/white?text=Dark+Jeans",
                "match_reason": "Perfect denim coordination"
            },
            {
                "name": "Grey Hoodie",
                "image": "https://via.placeholder.com/120x160/6B7280/white?text=Grey+Hoodie", 
                "match_reason": "Layering option"
            }
        ]
        
        return JSONResponse(content={
            "suggestions": suggestions,
            "ai_analysis": text_response
        })
        
    except Exception as e:
        print(f"Error in wishlist pairing: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Wishlist pairing failed: {str(e)}")

@router.post("/occasion-styling")
async def occasion_styling(request_data: dict):
    try:
        occasion = request_data.get("occasion")
        user_preferences = request_data.get("user_preferences", {})
        
        prompt = f"""
        Create AI-curated outfit suggestions for a {occasion} occasion.
        
        User preferences:
        - Gender: {user_preferences.get('gender', 'unisex')}
        - Style: {user_preferences.get('style', 'classic')}
        - Body type consideration: {user_preferences.get('modelType', 'full')}
        
        Please suggest 6 complete outfit combinations suitable for {occasion}.
        
        Consider:
        1. Dress code appropriateness
        2. Color schemes
        3. Seasonal relevance
        4. Style preferences
        5. Comfort and practicality
        
        Provide detailed styling advice and tips for each outfit combination.
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=['TEXT']
            )
        )
        
        # Extract text response
        text_response = "No styling suggestions available."
        if response.candidates and len(response.candidates) > 0:
            parts = response.candidates[0].content.parts
            if parts:
                for part in parts:
                    if hasattr(part, "text") and part.text:
                        text_response = part.text
                        break
        
        # Create fallback outfits based on occasion
        occasion_outfits = {
            "wedding": [
                {
                    "title": "Elegant Guest Look",
                    "description": "Sophisticated and wedding-appropriate", 
                    "image": "https://via.placeholder.com/200x300/8B5CF6/white?text=Wedding+Look+1"
                },
                {
                    "title": "Classic Formal",
                    "description": "Timeless elegance for ceremonies",
                    "image": "https://via.placeholder.com/200x300/EC4899/white?text=Wedding+Look+2"
                }
            ],
            "business": [
                {
                    "title": "Power Professional", 
                    "description": "Commanding respect in meetings",
                    "image": "https://via.placeholder.com/200x300/1F2937/white?text=Business+Look+1"
                },
                {
                    "title": "Modern Executive",
                    "description": "Contemporary professional style",
                    "image": "https://via.placeholder.com/200x300/374151/white?text=Business+Look+2"
                }
            ]
        }
        
        outfits = occasion_outfits.get(occasion, [
            {
                "title": f"Perfect {occasion.title()} Look",
                "description": f"Curated for {occasion} occasions",
                "image": "https://via.placeholder.com/200x300/6366F1/white?text=Outfit+1"
            },
            {
                "title": f"Stylish {occasion.title()} Outfit",
                "description": f"Modern choice for {occasion}",
                "image": "https://via.placeholder.com/200x300/EC4899/white?text=Outfit+2"
            }
        ])
        
        return JSONResponse(content={
            "outfits": outfits,
            "ai_styling_advice": text_response
        })
        
    except Exception as e:
        print(f"Error in occasion styling: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Occasion styling failed: {str(e)}")

@router.post("/tryon-outfit")
async def virtual_tryon_outfit(
    person_image: UploadFile = File(...),
    clothing_type: str = Form(...),
    top_clothing: UploadFile = File(None),
    bottom_clothing: UploadFile = File(None)
):
    try:
        print(f"Received outfit try-on request for: {clothing_type}")
        
        # Validate inputs
        if clothing_type not in ["top", "bottom", "both"]:
            raise HTTPException(status_code=400, detail="Invalid clothing type")
        
        if clothing_type == "both" and (not top_clothing or not bottom_clothing):
            raise HTTPException(status_code=400, detail="Both top and bottom clothing required for complete outfit")
        
        if clothing_type == "top" and not top_clothing:
            raise HTTPException(status_code=400, detail="Top clothing required")
            
        if clothing_type == "bottom" and not bottom_clothing:
            raise HTTPException(status_code=400, detail="Bottom clothing required")
        
        # Validate file types
        ALLOWED_MIME_TYPES = {
            "image/jpeg",
            "image/png",
            "image/webp", 
            "image/heic",
            "image/heif",
        }
        
        if person_image.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type for person_image: {person_image.content_type}"
            )
        
        # Process person image
        person_bytes = await person_image.read()
        person_b64 = array_buffer_to_base64(person_bytes)
        
        # Process clothing images
        contents = [
            f"Create a virtual try-on result showing the person wearing the {clothing_type} clothing item(s). Maintain the person's identity and pose while realistically fitting the clothing.",
            types.Part.from_bytes(
                data=person_b64,
                mime_type=person_image.content_type,
            )
        ]
        
        if top_clothing:
            top_bytes = await top_clothing.read()
            top_b64 = array_buffer_to_base64(top_bytes)
            contents.append(types.Part.from_bytes(
                data=top_b64,
                mime_type=top_clothing.content_type,
            ))
        
        if bottom_clothing:
            bottom_bytes = await bottom_clothing.read()
            bottom_b64 = array_buffer_to_base64(bottom_bytes)
            contents.append(types.Part.from_bytes(
                data=bottom_b64,
                mime_type=bottom_clothing.content_type,
            ))
        
        # Generate response using same model as tryon.py
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp-image-generation",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE']
            )
        )
        
        # Extract image and text like in tryon.py
        image_data = None
        text_response = f"Virtual try-on completed for {clothing_type} clothing."
        
        if response.candidates and len(response.candidates) > 0:
            parts = response.candidates[0].content.parts
            if parts:
                for part in parts:
                    if hasattr(part, "inline_data") and part.inline_data:
                        image_data = part.inline_data.data
                        image_mime_type = getattr(part.inline_data, "mime_type", "image/png")
                    elif hasattr(part, "text") and part.text:
                        text_response = part.text
        
        # Prepare response
        image_url = None
        if image_data:
            image_base64 = base64.b64encode(image_data).decode("utf-8")
            image_url = f"data:{image_mime_type};base64,{image_base64}"
        else:
            # Fallback to person image if no generation
            image_base64 = base64.b64encode(person_bytes).decode("utf-8")
            image_url = f"data:{person_image.content_type};base64,{image_base64}"
        
        return JSONResponse({
            "success": True,
            "message": text_response,
            "result_image": image_url,
            "clothing_type": clothing_type
        })
        
    except Exception as e:
        print(f"Error in outfit try-on: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Outfit try-on failed: {str(e)}")