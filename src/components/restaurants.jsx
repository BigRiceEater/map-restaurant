class Restaurants extends React.Component {
  getPriceRating = priceLevel => {
    if (priceLevel === undefined) return "N/A";

    let stars = "$";
    for (let i = 0; i < priceLevel; i++) stars += "$";
    return stars;
  };

  genShopOpening = isOpen => (
    <p style={{ color: isOpen ? "green" : "red" }}>
      {isOpen ? "Open" : "Closed"}
    </p>
  );

  render() {
    const { restaurants } = this.props;
    return restaurants.map((shop, idx) => {
      const { title, price, address, rating, isOpen, photo } = shop;
      return (
        <div className="row" key={idx}>
          <div className="card mx-2 my-2" style={{ width: "100%" }}>
            <div className="card-header" style={{ padding: 0 }}>
              <img
                className="card-img-top"
                style={{
                  height: "150px",
                  margin: 0,
                  padding: 0,
                  objectFit: "cover"
                }}
                src={photo}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Rating: {rating} | Price: {this.getPriceRating(price)}
                {this.genShopOpening(isOpen)}
              </h6>
              <p>{address}</p>
            </div>
          </div>
        </div>
      );
    });
  }
}
