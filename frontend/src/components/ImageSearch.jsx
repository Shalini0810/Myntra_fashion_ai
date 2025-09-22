import axios from "axios";
import { useState } from "react";
import { Button, Row, Col, Card, Typography, Spin, App } from "antd";
import { SearchOutlined, ShoppingOutlined } from "@ant-design/icons";
import ImageUpload from "./ImageUpload";

const { Title, Text } = Typography;

const ImageSearch = ({ isDarkMode = false }) => {
  const { message: messageApi } = App.useApp();
  const [searchImage, setSearchImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageSearch = async () => {
    if (!searchImage) {
      messageApi.error("Please upload an image to search for similar items");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("search_image", searchImage);
    formData.append("search_type", "image_matching");

    try {
      const response = await axios.post("http://localhost:8000/api/image-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSearchResults(response.data.matches);
      messageApi.success("Found matching items!");
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error searching for similar items");
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
        🔍 AI Image Search
      </h1>

      <Row gutter={[24, 24]}>
        {/* Image Upload */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <span style={titleStyle}>
                <SearchOutlined className="mr-2" />
                Upload Reference Image
              </span>
            }
            style={cardStyle}
            className="h-full"
          >
            <ImageUpload
              label="Upload image of item you like"
              onImageChange={setSearchImage}
              isDarkMode={isDarkMode}
            />
            
            <Button
              type="primary"
              onClick={handleImageSearch}
              loading={loading}
              disabled={!searchImage}
              block
              size="large"
              className="mt-6 h-12 text-lg font-medium"
            >
              {loading ? "Searching..." : "🔍 Find Similar Items"}
            </Button>
          </Card>
        </Col>

        {/* Search Results */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span style={titleStyle}>
                🎯 AI Search Results
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
                  AI is finding similar items...
                </p>
              </div>
            ) : searchResults.length > 0 ? (
              <Row gutter={[16, 16]}>
                {searchResults.map((item, index) => (
                  <Col xs={12} sm={8} md={6} key={index}>
                    <Card
                      hoverable
                      cover={
                        <img 
                          src={item.image} 
                          alt="Similar Item" 
                          className="h-40 object-cover"
                        />
                      }
                      style={{ background: isDarkMode ? "#2a2a2a" : "#fff" }}
                    >
                      <Card.Meta
                        title={
                          <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333", fontSize: 12 }}>
                            {item.similarity}% match
                          </Text>
                        }
                        description={
                          <Text style={{ color: isDarkMode ? "#a1a1aa" : "#666", fontSize: 10 }}>
                            {item.name || "Similar Item"}
                          </Text>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-12">
                <SearchOutlined 
                  className="text-6xl mb-4"
                  style={{ color: isDarkMode ? "#444" : "#d9d9d9" }}
                />
                <p 
                  style={{ color: isDarkMode ? "#a1a1aa" : "#666" }}
                >
                  Upload an image to find similar items using AI
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImageSearch;