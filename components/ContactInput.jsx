import { ArrowUpRight } from "lucide-react";
import "./ContactInput.css";

export default function ContactInput({
  label = "QUICK CONTACT",
  value = "CONTACT DETAILS · AVAILABLE",
}) {
  return (
    <div className="contact-input" aria-label="快速联系入口">
      <span className="contact-input-label">{label}</span>
      <span className="contact-input-shadow" aria-hidden="true" />
      <input
        className="contact-input-field"
        value={value}
        readOnly
        aria-label="当前联系方式"
      />
      <a
        className="contact-input-button"
        href="mailto:josonmichon@gmail.com"
        aria-label="发送邮件给陈宇航"
      >
        <ArrowUpRight size={24} strokeWidth={2.5} />
      </a>
    </div>
  );
}
