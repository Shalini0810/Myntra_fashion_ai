from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import google.genai as genai
import os
import base64
import io
from PIL import Image, ImageDraw
import random

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter(tags=["Styling"])

@router.post("/tryon-outfit")
async def tryon_complete_outfit(
    person_image: UploadFile = File(...),
    clothing_type: str = Form(...),  # "top", "bottom", "both"
    top_clothing: UploadFile = File(None),
    bottom_clothing: UploadFile = File(None)
):
    try:
        # Validate inputs based on clothing type
        if clothing_type == "both" and (not top_clothing or not bottom_clothing):
            raise HTTPException(status_code=400, detail="Both top and bottom clothing required for complete outfit")
        elif clothing_type == "top" and not top_clothing:
            raise HTTPException(status_code=400, detail="Top clothing required")
        elif clothing_type == "bottom" and not bottom_clothing:
            raise HTTPException(status_code=400, detail="Bottom clothing required")
        
        # Process person image
        person_data = await person_image.read()
        person_img = Image.open(io.BytesIO(person_data))
        
        # Convert person image to base64
        person_buffered = io.BytesIO()
        person_img.save(person_buffered, format="JPEG")
        person_base64 = base64.b64encode(person_buffered.getvalue()).decode()
        
        # Process clothing images
        clothing_data = []
        if top_clothing:
            top_data = await top_clothing.read()
            top_img = Image.open(io.BytesIO(top_data))
            top_buffered = io.BytesIO()
            top_img.save(top_buffered, format="JPEG")
            top_base64 = base64.b64encode(top_buffered.getvalue()).decode()
            clothing_data.append(("top", top_base64))
        
        if bottom_clothing:
            bottom_data = await bottom_clothing.read()
            bottom_img = Image.open(io.BytesIO(bottom_data))
            bottom_buffered = io.BytesIO()
            bottom_img.save(bottom_buffered, format="JPEG")
            bottom_base64 = base64.b64encode(bottom_buffered.getvalue()).decode()
            clothing_data.append(("bottom", bottom_base64))
        
        # Create prompt for AI analysis
        if clothing_type == "both":
            prompt = """
            Analyze this complete outfit try-on scenario:
            1. Person model image
            2. Top clothing item
            3. Bottom clothing item
            
            Provide:
            - How well the complete outfit works together
            - Color coordination analysis
            - Style compatibility
            - Fit predictions
            - Overall outfit rating
            - Styling suggestions for improvement
            - Occasion recommendations
            """
        else:
            prompt = f"""
            Analyze this {clothing_type} try-on scenario:
            1. Person model image
            2. {clothing_type.title()} clothing item
            
            Provide:
            - How well the {clothing_type} fits the person's style
            - Color analysis
            - Fit predictions
            - Styling suggestions
            - What to pair it with
            - Occasion recommendations
            """
        
        # Generate AI analysis
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Create content list for Gemini
        content_list = [prompt]
        content_list.append({"mime_type": "image/jpeg", "data": person_base64})
        
        for clothing_type_item, clothing_base64 in clothing_data:
            content_list.append({"mime_type": "image/jpeg", "data": clothing_base64})
        
        response = model.generate_content(content_list)
        
        # Generate a result image (placeholder for now)
        # In a real implementation, you would use actual try-on AI/ML models
        result_image = create_tryon_result_image(person_img, clothing_type)
        
        # Convert result to base64
        result_buffered = io.BytesIO()
        result_image.save(result_buffered, format="JPEG")
        result_base64 = base64.b64encode(result_buffered.getvalue()).decode()
        result_url = f"data:image/jpeg;base64,{result_base64}"
        
        return JSONResponse(content={
            "result_image": result_url,
            "analysis": response.text,
            "outfit_type": clothing_type,
            "confidence_score": random.randint(85, 95),
            "styling_tips": generate_styling_tips(clothing_type),
            "occasions": suggest_occasions(clothing_type)
        })
        
    except Exception as e:
        print(f"Error in outfit try-on: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Outfit try-on failed: {str(e)}")

def create_tryon_result_image(person_img, clothing_type):
    """Create a placeholder try-on result image"""
    # This is a placeholder implementation
    # In a real application, you would use sophisticated AI models for virtual try-on
    
    result_img = person_img.copy()
    draw = ImageDraw.Draw(result_img)
    
    # Add overlay text to simulate try-on result
    width, height = result_img.size
    text = f"Virtual Try-On Result\n{clothing_type.title()} Applied"
    
    # Add semi-transparent overlay
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle([(10, height-80), (width-10, height-10)], fill=(0, 0, 0, 128))
    
    result_img = Image.alpha_composite(result_img.convert('RGBA'), overlay)
    result_img = result_img.convert('RGB')
    
    return result_img

def generate_styling_tips(clothing_type):
    """Generate styling tips based on clothing type"""
    tips = {
        "top": [
            "Pair with neutral bottoms to let the top shine",
            "Consider the neckline when choosing accessories",
            "Tuck in for a more polished look"
        ],
        "bottom": [
            "Choose tops that complement the cut and style",
            "Consider proportions when styling",
            "Add a belt to define your waist"
        ],
        "both": [
            "The outfit is complete - add accessories to personalize",
            "Consider layering for different occasions",
            "Choose shoes that complement the overall aesthetic"
        ]
    }
    return tips.get(clothing_type, tips["both"])

def suggest_occasions(clothing_type):
    """Suggest appropriate occasions for the outfit"""
    occasions = {
        "top": ["Casual outings", "Work meetings", "Lunch dates"],
        "bottom": ["Weekend activities", "Shopping trips", "Casual dinners"],
        "both": ["Complete look for any occasion", "Date nights", "Social events"]
    }
    return occasions.get(clothing_type, occasions["both"])

@router.post("/wishlist-pairing")
async def wishlist_pairing(request: dict):
    """Find matching pieces for wishlist items"""
    try:
        selected_item = request.get("selected_item")
        preferences = request.get("user_preferences", {})
        
        prompt = f"""
        A user has selected "{selected_item}" from their wishlist.
        User preferences: {preferences}
        
        Suggest 6 complementary pieces that would pair well with this item.
        Consider:
        1. Color coordination
        2. Style compatibility  
        3. Occasion appropriateness
        4. Seasonal factors
        5. Current trends
        
        For each suggestion, explain why it works well with "{selected_item}".
        """
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Generate mock suggestions
        suggestions = []
        for i in range(6):
            suggestions.append({
                "name": f"Perfect Match {i+1}",
                "image": f"https://via.placeholder.com/160x200/FF6B6B/white?text=Match+{i+1}",
                "match_reason": f"Complements {selected_item} perfectly",
                "price": f"${random.randint(25, 150)}",
                "compatibility_score": random.randint(85, 98)
            })
        
        return JSONResponse(content={
            "suggestions": suggestions,
            "ai_analysis": response.text,
            "selected_item": selected_item
        })
        
    except Exception as e:
        print(f"Error in wishlist pairing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Wishlist pairing failed: {str(e)}")