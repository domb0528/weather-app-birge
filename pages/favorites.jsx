import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import Search from "./search";

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
      const user = req.session.user;
      const props = {};
      if (user) {
        props.user = req.session.user;
        props.isLoggedIn = true;
      } else {
        props.isLoggedIn = false;
      }
      return { props };
    },
    sessionOptions
  );
  
  export default function Login(props) {
    const router = useRouter();
    const [{ username, password }, setForm] = useState({
      username: "",
      password: "",
    });
    const [error, setError] = useState("");
    function handleChange(e) {
      setForm({ username, password, ...{ [e.target.name]: e.target.value } });
    }
    async function handleLogin(e) {
      e.preventDefault();
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        if (res.status === 200) return router.push("/dashboard");
        const { error: message } = await res.json();
        setError(message);
      } catch (err) {
        console.log(err);
      }
    }
    
      return (
        <div className={styles.container}>
          <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
          <main className={styles.main}>
            <h1 className={styles.title}>
              Welcome to the Weather Friend Favorites Page!
            </h1>
          </main>
        </div>
      );
    }