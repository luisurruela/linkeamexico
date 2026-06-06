import React, { type ChangeEvent, type FormEvent, useState } from "react";

interface IFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Utility function to parse state elements into x-www-form-urlencoded format
const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

function ContactForm() {
  const [state, setState] = useState<IFormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [response, setResponse] = useState<string>("");
  const [buttonTitle, setButtonTitle] = useState<string>("Enviar mensaje");

  // Dynamic evaluation ensures button stays disabled if any field remains blank or contains only whitespace
  const isButtonDisabled =
    state.name.trim() === "" ||
    state.email.trim() === "" ||
    state.phone.trim() === "" ||
    state.message.trim() === "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setButtonTitle("Enviando...");

    try {
      const endpoint = "/";

      // Merge Netlify identifier key with form fields and safely cast type constraints
      const formData = {
        "form-name": "contactForm",
        ...state,
      } as unknown as Record<string, string>;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(formData),
      });

      if (res.ok) {
        showSuccessMessage();
      } else {
        showErrorMessage();
        console.error("Error en la respuesta de Netlify Forms");
      }
    } catch (error) {
      showErrorMessage();
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const showSuccessMessage = () => {
    resetForm();
    setButtonTitle("Enviar mensaje");
    setResponse("Mensaje enviado correctamente. ¡Gracias!");

    setTimeout(() => {
      setResponse("");
    }, 9000);
  };

  const showErrorMessage = () => {
    setButtonTitle("Enviar mensaje");
    setResponse("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");

    setTimeout(() => {
      setResponse("");
    }, 9000);
  };

  const resetForm = () => {
    setState({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div>
      <form
        id="contactForm"
        name="contactForm"
        className="px-4 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
        data-netlify="true"
      >
        {/* Hidden field handles standard HTML crawling and links payload back to this target id */}
        <input type="hidden" name="form-name" value="contactForm" />

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-white/80 text-sm font-bold mb-2"
          >
            Tu nombre:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={state.name}
            className="text-sm border-purple-900 border-2 rounded-sm w-full py-2 px-3 text-white/70 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-white/80 text-sm font-bold mb-2"
          >
            Correo:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={state.email}
            className="text-sm border-purple-900 border-2 rounded-sm w-full py-2 px-3 text-white/70 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-white/80 text-sm font-bold mb-2"
          >
            Teléfono con Whatsapp:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={state.phone}
            required
            className="text-sm border-purple-900 border-2 rounded-sm w-full py-2 px-3 text-white/70 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-white/80 text-sm font-bold mb-2"
          >
            Mensaje:
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={state.message}
            className="text-sm border-purple-900 border-2 rounded-sm w-full py-2 px-3 text-white/70 leading-tight focus:outline-none focus:shadow-outline"
            placeholder='Con un "Hola Luis, me interesan tus servicios" es suficiente. Te mandaré mensaje de vuelta.'
            onChange={handleTextAreaChange}
          ></textarea>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-3">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-800 text-white/95 font-bold cursor-pointer py-2 px-4 focus:outline-none focus:shadow-outline w-full md:w-auto disabled:opacity-50 disabled:cursor-default hover:disabled:bg-purple-600"
            disabled={isButtonDisabled}
          >
            {buttonTitle}
          </button>
          <p className="text-white/90 text-center md:text-start text-sm">
            {response}
          </p>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
