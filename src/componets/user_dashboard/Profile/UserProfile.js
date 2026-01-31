import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import UserHeader from '../UserHeader';
import UserLeftNav from '../UserLeftNav';
import { useAuth } from '../../context/AuthContext';
import { useAuthFetch } from '../../context/AuthFetch';

const UserProfile = () => {
  const { auth } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for user profile
  const [formData, setFormData] = useState({
    id: null,
    member_id: "",
    full_name: "",
    email: "",
    phone: "",
    image: "",
    address: "",
    short_description: "",
    occupation: "",
    designation: "",
    department_name: "",
    organization_name: "",
    nature_of_work: "",
    education_level: "",
    status: "",
    other_text: "",
    district: "",
    state: "",
    created_at: "",
    updated_at: ""
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Store original data for reset
  const [originalFormData, setOriginalFormData] = useState(null);

  // Check device width
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setSidebarOpen(width >= 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (auth && auth.unique_id) {
      fetchUserProfile();
    }
  }, [auth]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch user profile from API using member_id
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      if (!auth || !auth.unique_id) {
        throw new Error("User not authenticated. Member ID not available.");
      }

      const url = `https://mahadevaaya.com/ngoproject/ngoproject_backend/api/member-reg/?member_id=${auth.unique_id}`;
      console.log("Fetching user profile from:", url);

      const response = await authFetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET User Profile API Response:", result);

      let profileData;
      
      // Handle different response formats
      if (Array.isArray(result)) {
        profileData = result[0] || {};
      } else if (result.data) {
        if (Array.isArray(result.data)) {
          profileData = result.data[0] || {};
        } else {
          profileData = result.data;
        }
      } else if (result.success && result.results && Array.isArray(result.results)) {
        profileData = result.results[0] || {};
      } else {
        profileData = result;
      }

      const profileFormData = {
        id: profileData.id || null,
        member_id: profileData.member_id || auth.unique_id || "",
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        image: profileData.image || "",
        address: profileData.address || "",
        short_description: profileData.short_description || "",
        occupation: profileData.occupation || "",
        designation: profileData.designation || "",
        department_name: profileData.department_name || "",
        organization_name: profileData.organization_name || "",
        nature_of_work: profileData.nature_of_work || "",
        education_level: profileData.education_level || "",
        status: profileData.status || "",
        other_text: profileData.other_text || "",
        district: profileData.district || "",
        state: profileData.state || "",
        created_at: profileData.created_at || "",
        updated_at: profileData.updated_at || ""
      };

      setFormData(profileFormData);
      setOriginalFormData(profileFormData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setMessage(error.message || "Failed to load profile data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enable editing mode
  const enableEditing = (e) => {
    e.preventDefault();
    setIsEditing(true);
    setShowAlert(false);
  };

  // Cancel editing and reset form
  const cancelEditing = () => {
    if (originalFormData) {
      setFormData(originalFormData);
    }
    setIsEditing(false);
    setShowAlert(false);
  };

  // Handle form submission (PUT to update profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Validate required fields
      if (!formData.member_id || !formData.full_name) {
        throw new Error("Member ID and Full Name are required fields.");
      }

      const payload = {
        member_id: formData.member_id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        image: formData.image,
        address: formData.address,
        short_description: formData.short_description,
        occupation: formData.occupation,
        designation: formData.designation,
        department_name: formData.department_name,
        organization_name: formData.organization_name,
        nature_of_work: formData.nature_of_work,
        education_level: formData.education_level,
        status: formData.status,
        other_text: formData.other_text,
        district: formData.district,
        state: formData.state
      };

      console.log("Submitting profile update for:", formData.member_id);
      console.log("Payload:", payload);

      const response = await authFetch(
        "https://mahadevaaya.com/ngoproject/ngoproject_backend/api/member-reg/",
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(
          errorData.message || errorData.detail || "Failed to update profile"
        );
      }

      const result = await response.json();
      console.log("Success response:", result);

      setMessage("Profile updated successfully!");
      setVariant("success");
      setShowAlert(true);
      setIsEditing(false);
      setOriginalFormData(formData);
      
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error: Could not connect to the server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <UserLeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Main Content */}
        <div className="main-content-dash">
          <UserHeader toggleSidebar={toggleSidebar} />

          <Container fluid className="dashboard-body dashboard-main-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title mb-0">My Profile</h1>
              {!isEditing && (
                <Button 
                  variant="primary" 
                  onClick={enableEditing}
                  disabled={isLoading}
                >
                  <FaEdit /> Edit Profile
                </Button>
              )}
            </div>

            {/* Alert for success/error messages */}
            {showAlert && (
              <Alert
                variant={variant}
                className="mb-4"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {message}
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading your profile...</p>
              </div>
            ) : (
              <Card className="mb-4">
                <Card.Header as="h5">
                  {isEditing ? "Edit Your Profile" : "Your Profile Information"}
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Member ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="member_id"
                            value={formData.member_id}
                            onChange={handleChange}
                            disabled={true}
                            className="form-control-plaintext"
                          />
                          <Form.Text className="text-muted">
                            Your unique member identifier (cannot be changed)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                           disabled={true}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                           disabled={true}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Short Description</Form.Label>
                          <Form.Control
                            type="text"
                            name="short_description"
                            value={formData.short_description}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Brief description about yourself"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Occupation</Form.Label>
                          <Form.Control
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., Software Developer, Student"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Designation</Form.Label>
                          <Form.Control
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., React Developer, Manager"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Department Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="department_name"
                            value={formData.department_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., Engineering, HR"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Organization Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="organization_name"
                            value={formData.organization_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., Brainrocks Consulting Services"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Education Level</Form.Label>
                          <Form.Control
                            type="text"
                            name="education_level"
                            value={formData.education_level}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., MCA, B.Tech, Other"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>District</Form.Label>
                          <Form.Control
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., dehradun"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="e.g., Uttarakhand"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nature of Work</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="nature_of_work"
                            value={formData.nature_of_work}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Describe your nature of work"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Image URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Image path or URL"
                          />
                          {formData.image && (
                            <div className="mt-2">
                              <img 
                                src={formData.image.startsWith('http') ? formData.image : `https://mahadevaaya.com/ngoproject/ngoproject_backend${formData.image}`}
                                alt="Profile"
                                style={{ maxHeight: "150px", objectFit: "cover", borderRadius: "4px" }}
                              />
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Additional Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="other_text"
                            value={formData.other_text}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Any additional information"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={true}
                            className="form-control-plaintext"
                          />
                          <Form.Text className="text-muted">
                            Your account status (cannot be changed)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    {formData.created_at && (
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Created At</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.created_at}
                              disabled={true}
                              className="form-control-plaintext"
                            />
                          </Form.Group>
                        </Col>
                        {formData.updated_at && (
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Last Updated</Form.Label>
                              <Form.Control
                                type="text"
                                value={formData.updated_at}
                                disabled={true}
                                className="form-control-plaintext"
                              />
                            </Form.Group>
                          </Col>
                        )}
                      </Row>
                    )}

                    {isEditing && (
                      <Row className="mt-4">
                        <Col className="d-flex gap-2 justify-content-end">
                          <Button
                            variant="secondary"
                            onClick={cancelEditing}
                            disabled={isSubmitting}
                          >
                            <FaTimes /> Cancel
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave /> Save Changes
                              </>
                            )}
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default UserProfile;