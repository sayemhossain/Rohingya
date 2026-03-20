"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiLocationMarker,
  HiMail,
  HiPhone,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";

const subjectOptions = [
  "General Inquiry",
  "Partnership",
  "Volunteering",
  "Donation",
  "Media",
  "Other",
];

const contactInfo = [
  {
    icon: HiLocationMarker,
    title: "Our Office",
    lines: [
      "Cox's Bazar District",
      "Chittagong Division",
      "Bangladesh",
    ],
  },
  {
    icon: HiMail,
    title: "Email Us",
    lines: ["info@rohingyainbangladesh.org", "media@rohingyainbangladesh.org"],
  },
  {
    icon: HiPhone,
    title: "Call Us",
    lines: ["+880-341-XXXXXX", "+880-2-XXXXXXXX (Dhaka)"],
  },
  {
    icon: HiClock,
    title: "Office Hours",
    lines: [
      "Sunday \u2014 Thursday: 9:00 AM \u2014 5:00 PM",
      "Friday \u2014 Saturday: Closed",
    ],
  },
];

const socialLinks = [
  { name: "Facebook", href: "#" },
  { name: "Twitter / X", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "YouTube", href: "#" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10" />
        <div className="container-custom relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            Have questions, want to partner, or need more information? We&apos;d
            love to hear from you. Reach out and our team will respond as soon as
            possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left -- Form */}
            <div className="lg:col-span-3">
              <h2 className="section-title mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you within 48
                hours.
              </p>

              {submitted ? (
                <div className="bg-brand/5 border border-brand/20 rounded-2xl p-8 text-center">
                  <HiCheckCircle className="text-brand-accent text-5xl mx-auto mb-4" />
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. Our team will review your message
                    and respond within 48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setError("");
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error message */}
                  {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                      <HiExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors bg-white"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors resize-vertical"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Right -- Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="bg-gray-50 rounded-xl p-6 flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-brand text-xl" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      {info.lines.map((line) => (
                        <p key={line} className="text-gray-600 text-sm">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Social Links */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-heading font-bold text-gray-900 mb-3">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-colors"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="bg-gray-100">
        <div className="w-full h-80 md:h-96 bg-gradient-to-br from-brand/10 via-brand-accent/10 to-brand/5 flex items-center justify-center">
          <div className="text-center">
            <HiLocationMarker className="text-brand/30 text-6xl mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-lg">Map</p>
            <p className="text-gray-400 text-sm">
              Interactive map will be added here
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
