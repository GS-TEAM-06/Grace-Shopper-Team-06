import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCards } from "../store/cards";
import { Link } from "react-router-dom";

class Cards extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCards();
  }

  render() {
    return (
      <div>
        {this.props.cards.map((card) => {
          return (
            <div key={card.id}>
              <h3>
                <Link to={`/cards/${card.id}`}>{card.name}</Link>
              </h3>
              <img src={card.imageUrl} />
              <h5>{card.price}</h5>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cards: state.cards,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCards: () => dispatch(fetchCards()),
  };
};

export default connect(mapState, mapDispatch)(Cards);
