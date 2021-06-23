import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {logout} from "../store";

import {AppBar, Toolbar, Typography, Grid} from "@material-ui/core";

import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  header: {
    position: "sticky",
  },
}));

const Navbar = (props) => {
  const classes = useStyles(props);

  return (
    <>
      <AppBar className={classes.header}>
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h4">
                <Link to="/">
                  <img src="/favicon.ico" height="70" width="auto" />
                </Link>
                <Link to="/" className="navbar">
                  Toad&Troll
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <nav>
                {props.isLoggedIn ? (
                  <div>
                    {/* The navbar will show these links after you log in */}
                    <Link to="/" className="navbar">
                      Main
                    </Link>
                    <Link className="navbar" to="/cart">
                      Cart
                    </Link>
                    <Link className="navbar" to="/user">
                      My Profile
                    </Link>
                    <a className="navbar" href="#" onClick={props.handleClick}>
                      Logout
                    </a>
                  </div>
                ) : (
                  <div>
                    {/* The navbar will show these links before you log in */}
                    <Link to="/" className="navbar">
                      Main
                    </Link>
                    <Link className="navbar" to="/cart">
                      Cart
                    </Link>
                    <Link className="navbar" to="/signup">
                      Sign Up
                    </Link>
                    <Link className="navbar" to="/login">
                      Login
                    </Link>
                  </div>
                )}
              </nav>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
