import axios from "axios";
import { useState } from "react";
import { Button, Row, Col, Card, Typography, Select, Spin, App, Badge, Tooltip } from "antd";
import { HeartOutlined, ShoppingOutlined, RobotOutlined } from "@ant-design/icons";
import ImageUpload from "./ImageUpload";

const { Title, Text } = Typography;
const { Option } = Select;

const SmartPairing = ({ isDarkMode = false }) => {
  const { message: messageApi } = App.useApp();
  const [uploadedItem, setUploadedItem] = useState(null);
  const [itemType, setItemType] = useState("");
  const [style, setStyle] = useState("casual");
  const [gender, setGender] = useState("unisex");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSmartPairing = async () => {
    if (!uploadedItem || !itemType) {
      messageApi.error("Please upload an item and select its type");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("item_image", uploadedItem);
      formData.append("item_type", itemType);
      formData.append("find_type", itemType === "top" ? "bottom" : "top");
      formData.append("style", style);
      formData.append("gender", gender);

      const response = await axios.post("http://localhost:8000/api/smart-pairing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.suggestions) {
        setAiSuggestions(response.data.suggestions);
        const generatedCount = response.data.suggestions.filter(s => s.generated).length;
        messageApi.success(
          `AI found perfect ${itemType === "top" ? "bottoms" : "tops"} for your item! ${generatedCount > 0 ? `${generatedCount} AI-generated images created.` : ''}`
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      
      if (error.response?.status === 500) {
        messageApi.error("Server error occurred. Please try again or check your API configuration.");
      } else if (error.response?.status === 422) {
        messageApi.error("Invalid file format. Please upload a valid image.");
      } else {
        messageApi.error("Error finding matching pieces. Please check your internet connection.");
      }
      
      // Set fallback suggestions
      setAiSuggestions([
        {
          name: "Classic White Shirt",
          image: "https://via.placeholder.com/160x200/FFFFFF/333333?text=White+Shirt",
          match_reason: "Versatile classic piece",
          styling_tip: "Perfect for any occasion",
          occasion: "Universal",
          confidence_score: 85,
          generated: false
        }
      ]);
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
        💝 AI Smart Pairing
      </h1>

      <Row gutter={[24, 24]}>
        {/* Item Upload */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <span style={titleStyle}>
                <ShoppingOutlined className="mr-2" />
                Your Item
              </span>
            }
            style={cardStyle}
            className="h-full"
          >
            <ImageUpload
              label="Upload your clothing item"
              onImageChange={setUploadedItem}
              isDarkMode={isDarkMode}
            />

            <div className="mt-6 space-y-4">
              <div>
                <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}>Item Type</Text>
                <Select
                  placeholder="What type of item is this?"
                  style={{ width: "100%", marginTop: 4 }}
                  value={itemType}
                  onChange={setItemType}
                  size="large"
                >
                  <Option value="top">👕 Top (Find matching bottoms)</Option>
                  <Option value="bottom">👖 Bottom (Find matching tops)</Option>
                </Select>
              </div>

              <div>
                <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}>Style Preference</Text>
                <Select
                  placeholder="Select style"
                  style={{ width: "100%", marginTop: 4 }}
                  value={style}
                  onChange={setStyle}
                  size="large"
                >
                  <Option value="casual">Casual</Option>
                  <Option value="formal">Formal</Option>
                  <Option value="streetwear">Streetwear</Option>
                  <Option value="traditional">Traditional</Option>
                  <Option value="sports">Sportswear</Option>
                </Select>
              </div>

              <div>
                <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}>Gender</Text>
                <Select
                  placeholder="Select gender"
                  style={{ width: "100%", marginTop: 4 }}
                  value={gender}
                  onChange={setGender}
                  size="large"
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="unisex">Unisex</Option>
                </Select>
              </div>
            </div>

            <Button
              type="primary"
              onClick={handleSmartPairing}
              loading={loading}
              disabled={!uploadedItem || !itemType}
              block
              size="large"
              className="mt-6 h-12 text-lg font-medium"
            >
              {loading ? "AI Generating..." : "✨ Generate AI Matches"}
            </Button>
          </Card>
        </Col>

        {/* AI Suggestions */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span style={titleStyle}>
                🎯 AI-Generated Pairing Suggestions
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
                  AI is analyzing your item and generating perfect matches...
                </p>
              </div>
            ) : aiSuggestions.length > 0 ? (
              <Row gutter={[16, 16]}>
                {aiSuggestions.map((suggestion, index) => (
                  <Col xs={12} sm={8} md={6} key={index}>
                    <Badge.Ribbon 
                      text={suggestion.generated ? "AI Generated" : "Suggested"}
                      color={suggestion.generated ? "#52c41a" : "#1890ff"}
                    >
                      <Card
                        hoverable
                        cover={
                          <div className="relative">
                            <img 
                              src={suggestion.image} 
                              alt="Suggestion" 
                              className="h-40 object-cover w-full"
                              onError={(e) => {
                                e.target.src = `data:image/svg+xml;base64,${btoa(`
                                  <svg width="160" height="200" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="160" height="200" fill="#f0f0f0"/>
                                    <text x="50%" y="50%" text-anchor="middle" fill="#999" font-family="Arial" font-size="12">
                                      ${suggestion.name}
                                    </text>
                                  </svg>
                                `)}`;
                              }}
                            />
                            {suggestion.generated && (
                              <Tooltip title="AI Generated Image">
                                <RobotOutlined 
                                  className="absolute top-2 right-2 text-green-500 bg-white rounded-full p-1"
                                  style={{ fontSize: '16px' }}
                                />
                              </Tooltip>
                            )}
                          </div>
                        }
                        style={{ background: isDarkMode ? "#2a2a2a" : "#fff" }}
                      >
                        <Card.Meta
                          title={
                            <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333", fontSize: 12 }}>
                              {suggestion.name}
                            </Text>
                          }
                          description={
                            <div>
                              <Text style={{ color: isDarkMode ? "#a1a1aa" : "#666", fontSize: 10 }}>
                                {suggestion.match_reason}
                              </Text>
                              {suggestion.confidence_score && (
                                <div className="mt-1">
                                  <Text style={{ color: isDarkMode ? "#52c41a" : "#389e0d", fontSize: 10 }}>
                                    {suggestion.confidence_score}% match confidence
                                  </Text>
                                </div>
                              )}
                            </div>
                          }
                        />
                      </Card>
                    </Badge.Ribbon>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-12">
                <HeartOutlined 
                  className="text-6xl mb-4"
                  style={{ color: isDarkMode ? "#444" : "#d9d9d9" }}
                />
                <p 
                  style={{ color: isDarkMode ? "#a1a1aa" : "#666" }}
                >
                  Upload your clothing item and AI will generate perfect matching pieces
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SmartPairing;