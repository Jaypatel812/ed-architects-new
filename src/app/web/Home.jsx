import React from "react";
import Wrapper from "../../components/Wrapper";
import HomeSlider from "../../components/HomeSlider";
import Counter from "../../components/Counter";

const Home = () => {
  return (
    <Wrapper>
      <HomeSlider />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 justify-center gap-6 py-6">
        <Counter count={485} title="Projects" />
        <Counter count={300} title="Clients" />
        <Counter count={18} title="Cities" />
        <Counter count={20000000} title="Sq Ft" />
      </div>
    </Wrapper>
  );
};

export default Home;
