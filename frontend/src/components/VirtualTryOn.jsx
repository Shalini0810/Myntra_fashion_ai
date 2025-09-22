import axios from "axios";
import { useState } from "react";
import { Button, Row, Col, Card, Typography, Select, message, Spin, App } from "antd";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import ImageUpload from "./ImageUpload";

const { Title, Text } = Typography;
const { Option } = Select;

const VirtualTryOn = ({ isDarkMode = false }) => {
  // Fix 1: Import App properly and use the hook correctly
  const { message: messageApi } = App.useApp();
  
  const [personImage, setPersonImage] = useState(null);
  const [topClothing, setTopClothing] = useState(null);
  const [bottomClothing, setBottomClothing] = useState(null);
  const [clothingType, setClothingType] = useState("both");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTryOn = async () => {
    // Fix 2: Use messageApi consistently instead of message
    if (!personImage) {
      messageApi.error("Please upload a person image");
      return;
    }

    if (clothingType === "both" && (!topClothing || !bottomClothing)) {
      messageApi.error("Please upload both top and bottom clothing items");
      return;
    }

    if (clothingType === "top" && !topClothing) {
      messageApi.error("Please upload a top clothing item");
      return;
    }

    if (clothingType === "bottom" && !bottomClothing) {
      messageApi.error("Please upload a bottom clothing item");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("person_image", personImage);
      formData.append("clothing_type", clothingType);

      if (topClothing) {
        formData.append("top_clothing", topClothing);
      }

      if (bottomClothing) {
        formData.append("bottom_clothing", bottomClothing);
      }

      const response = await axios.post("http://localhost:8000/api/tryon-outfit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Fix 3: Handle axios response correctly (axios doesn't have .ok property)
      // axios automatically throws on error status codes, so if we reach here, it succeeded
      
      // Fix 4: Access response data correctly (response.data, not response.json())
      setResult(response.data.result_image);
      messageApi.success("Virtual try-on completed!");
      
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("An error occurred during virtual try-on");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
    border: `1px solid ${isDarkMode ? "#444" : "#d9d9d9"}`,
    borderRadius: 12,
  };

  const titleStyle = {
    color: isDarkMode ? "#e5e5e5" : "#333",
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 
        className="text-4xl font-bold text-center mb-8"
        style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}
      >
        🎨 AI Virtual Try-On
      </h1>

      <Row gutter={[24, 24]}>
        {/* Person Image Upload */}
        <Col xs={24} lg={6}>
          <Card 
            title={
              <span style={titleStyle}>
                <UserOutlined className="mr-2" />
                Person Image
              </span>
            }
            style={cardStyle}
            className="h-full"
          >
            <ImageUpload
              label="Upload Your Photo"
              onImageChange={setPersonImage}
              isDarkMode={isDarkMode}
            />
          </Card>
        </Col>

        {/* Clothing Selection */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span style={titleStyle}>
                <ShoppingOutlined className="mr-2" />
                Clothing Items
              </span>
            }
            style={cardStyle}
            className="h-full"
          >
            {/* Clothing Type Selection */}
            <div className="mb-6">
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}
              >
                What would you like to try on?
              </label>
              <Select
                value={clothingType}
                onChange={setClothingType}
                className="w-full"
                size="large"
                style={{
                  backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
                }}
              >
                <Option value="top">👕 Top Only</Option>
                <Option value="bottom">👖 Bottom Only</Option>
                <Option value="both">👔 Complete Outfit (Top + Bottom)</Option>
              </Select>
            </div>

            <Row gutter={[16, 16]}>
              {/* Top Clothing Upload */}
              {(clothingType === "top" || clothingType === "both") && (
                <Col xs={24} sm={12}>
                  <div>
                    <h4 
                      className="text-center mb-2 font-medium"
                      style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}
                    >
                      Top Clothing
                    </h4>
                    <ImageUpload
                      onImageChange={setTopClothing}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </Col>
              )}

              {/* Bottom Clothing Upload */}
              {(clothingType === "bottom" || clothingType === "both") && (
                <Col xs={24} sm={12}>
                  <div>
                    <h4 
                      className="text-center mb-2 font-medium"
                      style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}
                    >
                      Bottom Clothing
                    </h4>
                    <ImageUpload
                      onImageChange={setBottomClothing}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </Col>
              )}
            </Row>

            {/* Try On Button */}
            <div className="mt-6">
              <Button
                type="primary"
                onClick={handleTryOn}
                loading={loading}
                block
                size="large"
                disabled={!personImage}
                className="h-12 text-lg font-medium"
              >
                {loading ? "Generating..." : "✨ Generate Virtual Try-On"}
              </Button>
            </div>
          </Card>
        </Col>

        {/* Result */}
        <Col xs={24} lg={6}>
          <Card 
            title={
              <span style={titleStyle}>
                🎯 AI Result
              </span>
            }
            style={cardStyle}
            className="h-full"
          >
            {loading ? (
              <div className="text-center py-12">
                <Spin size="large" />
                <p 
                  className="mt-4"
                  style={{ color: isDarkMode ? "#a1a1aa" : "#666" }}
                >
                  AI is generating your virtual try-on...
                </p>
              </div>
            ) : result ? (
              <div className="text-center">
                <img
                  src={result}
                  alt="Virtual Try-On Result"
                  className="w-full max-w-[250px] rounded-lg shadow-lg mx-auto"
                />
                <Button
                  type="default"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = result;
                    link.download = "virtual-tryon-result.jpg";
                    link.click();
                  }}
                  block
                  className="mt-4"
                >
                  📥 Download Result
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingOutlined 
                  className="text-6xl mb-4"
                  style={{ color: isDarkMode ? "#444" : "#d9d9d9" }}
                />
                <p 
                  style={{ color: isDarkMode ? "#a1a1aa" : "#666" }}
                >
                  Your AI-generated virtual try-on result will appear here
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VirtualTryOn;