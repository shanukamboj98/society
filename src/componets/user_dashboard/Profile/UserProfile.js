import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import UserHeader from '../UserHeader';
import UserLeftNav from '../UserLeftNav';
import { useAuth } from '../../context/AuthContext';
import { useAuthFetch } from '../../context/AuthFetch';

const UserProfile = () => {
  const { auth, refreshAccessToken } = useAuth();
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
    image: null, // Changed from empty string to null
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

  // image preview / existing image
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

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

      const response = await fetch(url, {
        method: "GET",
      });

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
        image: null, // Reset to null for proper handling
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
      setExistingImage(profileData.image || null);
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
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files && files[0];
      setFormData(prev => ({ ...prev, image: file || null }));
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

      // Create payload excluding read-only fields (email, phone, status) for JSON submission
      const jsonPayload = {
        full_name: formData.full_name,
        address: formData.address,
        short_description: formData.short_description,
        occupation: formData.occupation,
        designation: formData.designation,
        department_name: formData.department_name,
        organization_name: formData.organization_name,
        nature_of_work: formData.nature_of_work,
        education_level: formData.education_level,
        other_text: formData.other_text,
        district: formData.district,
        state: formData.state
      };

      console.log("Submitting profile update for:", formData.member_id);
      console.log("JSON Payload:", jsonPayload);

      const isFileImage = formData.image && typeof formData.image === 'object' && formData.image instanceof File;

      let response;

      if (isFileImage) {
        // For FormData (when there's a new image), include member_id as it's required by the API
        const dataToSend = new FormData();
        if (formData.id) dataToSend.append('id', formData.id);
        dataToSend.append('member_id', formData.member_id); // Include member_id for FormData
        dataToSend.append('full_name', formData.full_name);
        dataToSend.append('address', formData.address);
        dataToSend.append('short_description', formData.short_description);
        dataToSend.append('occupation', formData.occupation);
        dataToSend.append('designation', formData.designation);
        dataToSend.append('department_name', formData.department_name);
        dataToSend.append('organization_name', formData.organization_name);
        dataToSend.append('nature_of_work', formData.nature_of_work);
        dataToSend.append('education_level', formData.education_level);
        dataToSend.append('other_text', formData.other_text);
        dataToSend.append('district', formData.district);
        dataToSend.append('state', formData.state);
        dataToSend.append('image', formData.image, formData.image.name);

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/ngoproject/ngoproject_backend/api/member-reg/?id=${formData.id}`;
        console.log('PUT URL (FormData):', url);

        response = await fetch(url, {
          method: 'PUT',
          body: dataToSend,
          headers: { Authorization: `Bearer ${auth?.access}` },
        });

        if (response.status === 401) {
          const newAccess = await refreshAccessToken();
          if (!newAccess) throw new Error('Session expired');
          response = await fetch(url, {
            method: 'PUT',
            body: dataToSend,
            headers: { Authorization: `Bearer ${newAccess}` },
          });
        }
      } else {
        // For JSON submission (when there's no new image), exclude member_id
        const url = `https://mahadevaaya.com/ngoproject/ngoproject_backend/api/member-reg/?id=${formData.id}`;
        console.log('PUT URL (JSON):', url);
        
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.access}`,
          },
          body: JSON.stringify(jsonPayload),
        });

        if (response.status === 401) {
          const newAccess = await refreshAccessToken();
          if (!newAccess) throw new Error('Session expired');
          response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newAccess}`,
            },
            body: JSON.stringify(jsonPayload),
          });
        }
      }

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;
        try { 
          errorData = JSON.parse(errorText); 
        } catch (e) { 
          /* not JSON */ 
        }
        console.error('Server error response:', errorData || errorText);
        
        // Provide more specific error messages
        if (errorData && errorData.errors) {
          if (errorData.errors.email) {
            throw new Error('Email address is already in use');
          } else if (errorData.errors.phone) {
            throw new Error('Phone number is already in use');
          } else if (errorData.errors.member_id) {
            throw new Error('Member ID is already in use');
          }
        }
        
        throw new Error((errorData && (errorData.message || errorData.detail)) || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Success response:', result);

      setMessage('Profile updated successfully!');
      setVariant('success');
      setShowAlert(true);
      setIsEditing(false);
      
      // Update the original form data with the current form data
      setOriginalFormData({
        ...formData,
        image: null // Reset image to null
      });

      // Update existing image if available
      if (result.data && result.data.image) {
        setExistingImage(result.data.image);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: null }));
      }

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
                          <Form.Text className="text-muted">
                            Your email address (cannot be changed)
                          </Form.Text>
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
                          <Form.Text className="text-muted">
                            Your phone number (cannot be changed)
                          </Form.Text>
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
                          <Form.Label>Profile Image</Form.Label>
                          {isEditing ? (
                            <>
                              <Form.Control
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                              />
                              {imagePreview ? (
                                <div className="mt-3">
                                  <p>New Image Preview:</p>
                                  <img
                                    src={imagePreview}
                                    alt="Image Preview"
                                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                                  />
                                </div>
                              ) : (
                                existingImage && (
                                  <div className="mt-3">
                                    <p>Current Image:</p>
                                    <img
                                      src={`https://mahadevaaya.com/ngoproject/ngoproject_backend${existingImage}`}
                                      alt="Current Image"
                                      style={{ maxHeight: "150px", objectFit: "cover", borderRadius: "4px" }}
                                    />
                                  </div>
                                )
                              )}
                            </>
                          ) : (
                            existingImage && (
                              <div className="mt-3">
                                <img 
                                  src={`https://mahadevaaya.com/ngoproject/ngoproject_backend${existingImage}`}
                                  alt="Profile"
                                  style={{ maxHeight: "150px", objectFit: "cover", borderRadius: "4px" }}
                                />
                              </div>
                            )
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