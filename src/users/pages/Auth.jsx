import { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import "./Auth.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    // console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        // if (!response.ok) {
        //   throw new Error(response.message);
        //   // console.log(response.message);
        // }
        // console.log(response.message);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
          // console.log(response.message);
        }
        // console.log(data.user._id);
        auth.login(data.userId, data.token);
        console.log(data);
      } catch (err) {
        setError(err.message || "Something went wrong, please try again");
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/signup", {
          method: "POST",

          body: formData,
        });
        // if (!response.ok) {
        //   throw new Error(response.message);
        //   // console.log(response.message);
        // }
        // console.log(response.message);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
          // console.log(response.message);
        }
        // console.log(data.user._id);
        auth.login(data.userId, data.token);
      } catch (err) {
        setError(err.message || "Something went wrong, please try again");
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={() => setError(null)} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && <Input element="input" id="name" type="text" label="Your Name" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a name." onInput={inputHandler} />}
          {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image" />}
          <Input element="input" id="email" type="email" label="E-Mail" validators={[VALIDATOR_EMAIL()]} errorText="Please enter a valid email address." onInput={inputHandler} />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
