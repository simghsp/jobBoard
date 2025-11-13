import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Server error";
      setErr(message);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-md">
      <h2 className="text-xl font-semibold">Register</h2>
      <form
        onSubmit={submit}
        className="bg-white p-6 mt-4 rounded shadow space-y-3"
      >
        {err && <div className="text-red-600">{err}</div>}
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2"
          placeholder="Full name"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2"
          placeholder="Email"
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2"
          placeholder="Password"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border p-2"
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>
        {form.role === "employer" && (
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full border p-2"
            placeholder="Company name"
          />
        )}
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
