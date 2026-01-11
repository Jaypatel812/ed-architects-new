import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import HomeSlider from "../../components/HomeSlider";
import Counter from "../../components/Counter";
import { useGetHomeDataMutation } from "../../redux/api/edApi";

const Home = () => {
  const [getHomeData] = useGetHomeDataMutation();
  const [homeData, setHomeData] = useState(null);

  const fetchHomeData = async () => {
    try {
      const res = await getHomeData();
      if (res.data.success) {
        setHomeData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);
  return (
    <Wrapper>
      <HomeSlider carouselData={homeData?.carousel} />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 items-center justify-center gap-6 py-6">
        <Counter count={homeData?.counts.totalProjects} title="Projects" />
        <Counter count={homeData?.counts.totalClients} title="Clients" />
        <Counter count={homeData?.counts.totalCities} title="Cities" />
        <Counter count={homeData?.counts.totalArea} title="Sq Ft" />
      </div>
    </Wrapper>
  );
};

export default Home;
