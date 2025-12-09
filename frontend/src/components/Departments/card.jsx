const DepartmentCard = ({ icon, title, description }) => {
  return (
    <section className="department-item">
      <section className="department-icon">{icon}</section>
      <section className="divider"></section>
      <h3>{title}</h3>
      <section className="tag-description">
        <p className="description">{description}</p>
      </section>
    </section>
  );
};
export default DepartmentCard;
