import { useEffect, useState } from "react";
import DepartmentCard from "./card"; 
import axios from "axios";
import "./department.css";

const Department = () => {
  const [departments, setDepartments] = useState([]);

  // Icons 
  const icons = [
      <i className="fas fa-hospital-user"></i>]

  useEffect(() => {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get("http://localhost:2411/api/departments");

          console.log("FULL API RESPONSE:", response.data);

          if (response.data.success) {
            setDepartments(response.data.data.departments);
          }
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      };

      fetchDepartments();
    }, []);


  return (
    <>
      <section id="department" className="department-section p-block-70">
        {/* Section Title */}
        <section className="section-title">
          <h2>Enat Health Care Departments</h2>
          <p>Departments at Enat Health Care Solutions.</p>
        </section>

        {/* Department Cards Container (Dynamic) */}
        <section className="department-grid">
            {departments.length > 0 ? (
              departments.map((dept, index) => (
                <DepartmentCard
                  key={dept.id}
                  icon={icons[index % icons.length]} // Loop icons
                  title={dept.department_name}
                  description={dept.department_description}
                />
              ))
            ) : (
              <p>Loading departments...</p>
            )}
        </section>

        {/* Hero Section Under Department */}
        <section className="hero-layout">
          <section className="hero-image"></section>

          <section className="hero-text">
            <h2>Nurturing Health with Compassion And Excellence</h2>
            <h4 className="hero-sub">Your Trusted Partner for holistic family wellness and advanced medical care in Addis Ababa.</h4>
            <p>At Enat Health Care Solutions, we believe treating every patient with the care and dedication of a mother. from maternal health and pediatrics to chronic disease management, our specialized team is committed to delivering personalized,high-quality healthcare to ensure the well-being of our community.</p>
          </section>
        </section>
      </section>
    </>
  );
};

export default Department;
