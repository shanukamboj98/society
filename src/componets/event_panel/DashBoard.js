import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert, Form, Dropdown } from "react-bootstrap";
import axios from "axios";
import "../../assets/css/dashboard.css";
import DashBoardHeader from "./DashBoardHeader";
import LeftNav from "./LeftNav";
import "../../assets/css/dashboardcards.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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

  // Fetch data from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://mahadevaaya.com/ngoproject/ngoproject_backend/api/member-reg/"
        );
        setMembers(response.data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch member data. Please try again later.");
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Calculate counts
  const totalCount = members.length;
  const pendingCount = members.filter((member) => member.status === "pending").length;
  const acceptedCount = members.filter((member) => member.status === "accepted").length;
  const rejectedCount = members.filter((member) => member.status === "rejected").length;

  // Handle card click
  const handleCardClick = () => {
    setShowTable(true);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Filter members based on active filter
  const filteredMembers = activeFilter === "all" 
    ? members 
    : members.filter((member) => member.status === activeFilter);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Function to get badge color based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "accepted":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <>
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <LeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Main Content */}
        <div className="main-content-dash">
          <DashBoardHeader toggleSidebar={toggleSidebar} />

          <Container fluid className="dashboard-body dashboard-main-container">
            <h1 className="page-title">Dashboard</h1>
            
            {loading ? (
              <div className="loading-spinner text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger" className="dashboard-alert">{error}</Alert>
            ) : (
              <>
                {/* Show only one card for all members */}
                <Row className="dashboard-cards mb-4">
                  <Col md={3} className="mb-3">
                    <Card 
                      className="dashboard-card card-all text-center h-100 cursor-pointer"
                      onClick={handleCardClick}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Body>
                        <Card.Title>All Members</Card.Title>
                        <h2>{totalCount}</h2>
                        <div className="card-icon">
                          <i className="fas fa-users"></i>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Show table with filter when card is clicked */}
                {showTable && (
                  <div className="btn-heading-title">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2>
                        {activeFilter === "all" 
                          ? "All Members" 
                          : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Members`}
                        ({filteredMembers.length})
                      </h2>
                      <div>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" id="filter-dropdown">
                            Filter: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item 
                              onClick={() => handleFilterChange("all")}
                              active={activeFilter === "all"}
                            >
                              All
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handleFilterChange("pending")}
                              active={activeFilter === "pending"}
                            >
                              Pending ({pendingCount})
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handleFilterChange("accepted")}
                              active={activeFilter === "accepted"}
                            >
                              Accepted ({acceptedCount})
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handleFilterChange("rejected")}
                              active={activeFilter === "rejected"}
                            >
                              Rejected ({rejectedCount})
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="dashboard-table">
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Member ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Occupation</th>
                            <th>Education</th>
                            <th>Status</th>
                            <th>Registration Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((member) => (
                            <tr key={member.id}>
                              <td>{member.id}</td>
                              <td>{member.member_id}</td>
                              <td>{member.full_name}</td>
                              <td>{member.email}</td>
                              <td>{member.phone}</td>
                              <td>{member.occupation || "N/A"}</td>
                              <td>{member.education_level || "N/A"}</td>
                              <td>
                                <span className={`badge status-badge ${getStatusBadgeClass(member.status)}`}>
                                  {member.status || "N/A"}
                                </span>
                              </td>
                              <td>{formatDate(member.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </>
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default Dashboard;