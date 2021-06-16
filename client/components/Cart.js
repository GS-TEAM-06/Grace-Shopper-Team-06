import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Cart extends Component {
  constructor() {
    super();
    this.handleDecreaseQuantity = this.handleDecreaseQuantity.bind(this);
    this.handleIncreaseQuantity = this.handleIncreaseQuantity.bind(this);
  }

  componentDidMount() {
    this.props.fetchCart(cardId);
  }

  handleIncreaseQuantity() {}

  handleDecreaseQuantity() {}

  render() {
    // let addedCards = this.props.cards.length ? (
    //   this.props.cards.map((card) => {
    //     return (
    //       <div>
    //         <li key={card.id}>
    //           <div>
    //             <img src={card.imgUrl} />
    //           </div>
    //           <Link to={`/cards/${card.id}`}>
    //             <p>{card.name}</p>
    //           </Link>
    //           <p>{card.description}</p>
    //           <p>{card.price}</p>
    //         </li>
    //         <div>
    //           <form>
    //             <div onClick={this.handleDecreaseQuantity}>-</div>
    //             <input value="1" />
    //             <div onClick={this.handleIncreaseQuantity}>+</div>
    //           </form>
    //         </div>
    //       </div>
    //     );
    //   })
    // ) : (
    //   <p>Nothing</p>
    // );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul></ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cards: state.addedCards,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (orderId) => fetchCart(orderId),
  };
};

export default connect(mapState, mapDispatch)(Cart);
