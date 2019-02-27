class Restaurants extends React.Component {
  getPriceRating = priceLevel => {
    let stars = "";
    for (let i = 0; i < priceLevel; i++) stars += "*";
    return stars;
  };

  render() {
    const { restaurants } = this.props;
    return (
      <div>
        <ul>
          {restaurants.map((shop, idx) => {
            const { title, price, rating, isOpen } = shop;
            return (
              <li key={idx}>
                <div className="restaurant-item">
                  <h1>{title}</h1>
                  <p>rating: {rating}</p>
                  <p>price: {this.getPriceRating(price)}</p>
                  <p>{isOpen ? "Open" : "Closed"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
