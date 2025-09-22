import axios from "axios";
import { useState } from "react";
import { Button, Row, Col, Card, Typography, Select, Spin, App } from "antd";
import { CalendarOutlined, ShoppingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const OccasionStyling = ({ isDarkMode = false }) => {
  const { message: messageApi } = App.useApp();
  const [occasionType, setOccasionType] = useState("");
  const [style, setStyle] = useState("");
  const [gender, setGender] = useState("");
  const [budget, setBudget] = useState("");
  const [aiOutfits, setAiOutfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOccasionStyling = async () => {
    if (!occasionType) {
      messageApi.error("Please select an occasion");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8000/api/occasion-styling", {
        occasion: occasionType,
        user_preferences: { gender, style, budget }
      });

      setAiOutfits(response.data.outfits);
      messageApi.success(`AI curated perfect ${occasionType} outfits for you!`);
    } catch (error) {
      console.error("Error:", error);
      messageApi.error("Error creating occasion-based outfits");
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
        🎯 AI Occasion Styling
      </h1>

      <Row gutter={[24, 24]}>
        {/* Occasion Selection */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <span style={titleStyle}>
                <CalendarOutlined className="mr-2" />
                Select Occasion
              </span>
            }
            style={cardStyle}
            className="h-full"
          >
            <div className="space-y-4">
              <div>
                <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}>Occasion</Text>
                <Select
                  placeholder="Choose an occasion"
                  style={{ width: "100%", marginTop: 4 }}
                  size="large"
                  value={occasionType}
                  onChange={setOccasionType}
                >
                  <Option value="wedding">Wedding Guest</Option>
                  <Option value="business">Business Meeting</Option>
                  <Option value="date">Date Night</Option>
                  <Option value="party">Cocktail Party</Option>
                  <Option value="casual">Casual Hangout</Option>
                  <Option value="formal">Formal Event</Option>
                  <Option value="vacation">Vacation</Option>
                  <Option value="interview">Job Interview</Option>
                </Select>
              </div>

              <div>
                <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}>Style Preference</Text>
                <Select
                  placeholder="Select your style"
                  style={{ width: "100%", marginTop: 4 }}
                  value={style}
                  onChange={setStyle}
                  size="large"
                >
                  <Option value="classic">Classic</Option>
                  <Option value="trendy">Trendy</Option>
                  <Option value="boho">Bohemian</Option>
                  <Option value="minimalist">Minimalist</Option>
                  <Option value="edgy">Edgy</Option>
                  <Option value="romantic">Romantic</Option>
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

              <div>
                <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333" }}>Budget Range</Text>
                <Select
                  placeholder="Select budget"
                  style={{ width: "100%", marginTop: 4 }}
                  value={budget}
                  onChange={setBudget}
                  size="large"
                >
                  <Option value="budget">Budget Friendly</Option>
                  <Option value="mid">Mid Range</Option>
                  <Option value="luxury">Luxury</Option>
                </Select>
              </div>
            </div>

            <Button
              type="primary"
              onClick={handleOccasionStyling}
              loading={loading}
              disabled={!occasionType}
              block
              size="large"
              className="mt-6 h-12 text-lg font-medium"
            >
              {loading ? "Curating..." : "✨ Get AI Styling Suggestions"}
            </Button>
          </Card>
        </Col>

        {/* AI Curated Outfits */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span style={titleStyle}>
                🎯 AI Curated Outfits
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
                  AI is curating perfect outfits for your occasion...
                </p>
              </div>
            ) : aiOutfits.length > 0 ? (
              <Row gutter={[16, 16]}>
                {aiOutfits.map((outfit, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <Card
                      hoverable
                      cover={
                        <img 
                          src={outfit.image} 
                          alt="Outfit" 
                          className="h-48 object-cover"
                        />
                      }
                      style={{ background: isDarkMode ? "#2a2a2a" : "#fff" }}
                    >
                      <Card.Meta
                        title={
                          <Text style={{ color: isDarkMode ? "#e5e5e5" : "#333", fontSize: 14 }}>
                            {outfit.title}
                          </Text>
                        }
                        description={
                          <Text style={{ color: isDarkMode ? "#a1a1aa" : "#666", fontSize: 12 }}>
                            {outfit.description}
                          </Text>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-12">
                <CalendarOutlined 
                  className="text-6xl mb-4"
                  style={{ color: isDarkMode ? "#444" : "#d9d9d9" }}
                />
                <p 
                  style={{ color: isDarkMode ? "#a1a1aa" : "#666" }}
                >
                  Select an occasion and AI will curate perfect outfits for you
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OccasionStyling;