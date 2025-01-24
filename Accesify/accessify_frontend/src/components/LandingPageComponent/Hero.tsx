import herBg from "../../assets/images/Container.png";
import Nav from "./Nav";
const Hero = () => {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat h-screen w-full flex flex-col items-center "
      style={{ backgroundImage: `url(${herBg})` }}
    >
      <Nav />
    </section>
  );
};

export default Hero;
