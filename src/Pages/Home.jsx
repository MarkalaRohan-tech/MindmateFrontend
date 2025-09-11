import React from 'react'
import "../App.css"
import { NavLink } from 'react-router-dom';
import FeaturesCard from './FeaturesCard';
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const features = [
    {
      id: 1,
      heading: "Track Your Mood",
      description:
        "Effortlessly log your daily emotions and gain insights into your emotional patterns over time.",
      icon: "fas fa-smile",
    },
    {
      id: 2,
      heading: "Connect with Peers",
      description:
        "Engage in supportive conversations with a compassionate community that understands your journey.",
      icon: "fas fa-comments",
    },
    {
      id: 3,
      heading: "AI-Powered Suggestions",
      description:
        "Receive personalized mental wellness tips and guidance tailored just for you.",
      icon: "fas fa-lightbulb",
    },
    {
      id: 4,
      heading: "Reflective Journaling",
      description:
        "Utilize guided prompts to explore your thoughts and feelings, fostering self-awareness.",
      icon: "fas fa-book-open",
    },
    {
      id: 5,
      heading: "Earn Rewards",
      description:
        "Celebrate your progress and self-care efforts with an engaging point and badge system.",
      icon: "fas fa-award",
    },
    {
      id: 6,
      heading: "Community Support",
      description:
        "Find strength and solidarity within a safe and encouraging environment.",
      icon: "fas fa-users",
    },
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Alex K.",
      role: "Freelance Designer",
      review:
        "MoodMate has truly transformed how I approach my mental well-being. The mood tracking is insightful, and the AI suggestions are surprisingly helpful!",
      image: "/UserPic/alex.jpg",
    },
    {
      id: 2,
      name: "Samantha R.",
      role: "Marketing Manager",
      review:
        "This app gives me peace of mind on stressful days. Journaling helps me stay grounded and the community is super supportive.",
      image: "/UserPic/sam.jpg",
    },
    {
      id: 3,
      name: "Jordan L.",
      role: "College Student",
      review:
        "MoodMate is a lifesaver during exam weeks. It keeps me emotionally in check and the rewards system is fun motivation.",
      image: "/UserPic/jordan.jpg",
    },
    {
      id: 4,
      name: "Priya M.",
      role: "Yoga Instructor",
      review:
        "A perfect companion to my daily wellness routine. I love the clean design and reflective journaling prompts.",
      image: "/UserPic/priya.jpg",
    },
    {
      id: 5,
      name: "David B.",
      role: "Software Developer",
      review:
        "The AI tips feel very tailored and relevant. It's like having a calm friend reminding me to take care of myself.",
      image: "/UserPic/david.jpg",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center overflow-x-hidden">
      <div className="relative w-full h-[50vh] md:h-screen z-0">
        <div
          className="absolute inset-0 bg-cover bg-left bg-no-repeat opacity-90"
          style={{ backgroundImage: 'url("/buddhaImg.png")' }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center items-center md:items-end h-full p-5">
          <h1 className="text-md md:text-3xl lg:text-5xl pt-5 mt-5 md:mb-5 text-shadow-lg  font-bold text-white text-center">
            Your Sanctuary for Mental Health
          </h1>
          <p className="font-light mb-5 md:font-medium w-2/3 md:w-1/2 text-xs md:text-md lg:text-lg text-white text-left text-shadow-lg">
            Welcome to MindMate, your personal space for emotional well-being
            and mental clarity. Whether you're navigating daily stress, seeking
            self-care routines, or simply need a moment of calm, we're here to
            support you. From mood tracking and AI-powered suggestions to
            uplifting messages and peer connection, everything is designed to
            help you feel heard, valued, and empowered. Begin your journey
            toward balance and peace.
          </p>
          <div className="text-md md:text-lg text-white lg:text-3xl font-semibold text-shadow-lg">
            A sound mind is sound life.
          </div>
          <div className="row flex flex-row w-1/2 md:p-4 gap-2 justify-center items-center mt-5">
            <NavLink to="/register">
              <button className="btn shadow-lg bg-white ml-5 mr-5 text-orange-400">
                <b>Signup</b>
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className="btn shadow-lg bg-white ml-5 mr-5 text-orange-400">
                <b>Login</b>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <h1 className={`${theme === "dark" ? "text-white" : "text-black"} font-semibold mt-5 mb-5 pt-5 pb-5 text-center text-shadow-lg text-lg md:text-3xl lg:text-5xl`}>
        How MoodMate Help You Thrive
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 p-1 md:p-5 mb-5 w-[100vw]">
        {features.map((feature) => (
          <FeaturesCard
            key={feature.id}
            header={feature.heading}
            icon={feature.icon}
            para={feature.description}
          ></FeaturesCard>
        ))}
      </div>
      <div className="w-full px-4 py-10">
        <h2 className={` ${theme === "dark" ? "text-white" : "text-black"} text-center text-2xl md:text-4xl font-bold mb-8`}>
          What Our Users Say
        </h2>
        <center>
          <div className={`carousel ${
        theme === "dark" ? "bg-gray-600 shadow-gray-700" : "text-black"
      } w-[90%] md:w-[70%] mb-5 px-5 rounded-2xl shadow-xl`}>
            {testimonials.map((user, index) => {
              const prev = `#slide${index === 0 ? testimonials.length : index}`;
              const next = `#slide${
                index + 2 > testimonials.length ? 1 : index + 2
              }`;
              return (
                <div
                  id={`slide${user.id}`}
                  key={user.id}
                  className="carousel-item relative w-full flex flex-col items-center justify-center p-5 gap-4"
                >
                  <div className="w-full md:w-[80%] mx-auto flex flex-col items-start gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="rounded-full border-2 border-orange-200"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <p className="text-orange-400 text-left font-semibold">
                          {user.name}
                        </p>
                        <p className="text-xs text-orange-400">{user.role}</p>
                      </div>
                    </div>
                    <p className={` ${theme === "dark" ? "text-white" : "text-black"} text-md mb:text-xl mb-5 pb-5 text-center`}>
                      {user.review}
                    </p>
                  </div>
                  <div className="absolute left-4 right-4 bottom-4 flex justify-between">
                    <a
                      href={prev}
                      className="btn btn-circle bg-orange-100 text-orange-500 hover:bg-orange-200"
                    >
                      ❮
                    </a>
                    <a
                      href={next}
                      className="btn btn-circle bg-orange-100 text-orange-500 hover:bg-orange-200"
                    >
                      ❯
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </center>
        <div className="card mt-5 mb-5 mx-auto p-5 w-[90%] rounded-2xl bg-linear-55 from-orange-400 to-yellow-400 md:w-[80%]">
          <h1 className=" text-xl md:text-5xl mt-5 text-center text-white font-bold">
            Ready To Start Your Journey To Inner Peace?
          </h1>
          <p className="text-xs md:text-lg mt-5 w-[100%] md:w-[80%] mx-auto text-center text-white font-semibold">
            Join thousands of individuals finding calm, connection, and clarity
            with MoodMate. Sign up today and nurture your well-being. Discover
            tools designed to support your emotional balance, from mood tracking
            to guided journaling, all in one peaceful space. Whether you're just
            starting your mental wellness journey or looking to deepen your
            self-care routine, MoodMate is here to walk with you—every step of
            the way.
          </p>
          <div className="row flex flex-row w-full md:p-4 gap-2 justify-center items-center mt-5">
            <NavLink to="/register">
              <button className="btn shadow-lg bg-white ml-5 mr-5 text-orange-400">
                <b>Signup</b>
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className="btn shadow-lg bg-white ml-5 mr-5 text-orange-400">
                <b>Login</b>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home