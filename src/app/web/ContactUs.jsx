import React from "react";
import { LuMail, LuPhone } from "react-icons/lu";
import Wrapper from "../../components/Wrapper";

const ContactUs = () => {
  return (
    <Wrapper>
      <div className="flex text-neutral-500 flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-5">
          <div>
            <div className="font-bold mb-3">Office</div>
            <div>903, Shilp Epitome</div>
            <div>Opp Nayra Petrol Pump</div>
            <div>Behind Rajpath Club,</div>
            <div>Rajpath Club Road,</div>
            <div>Bodakdev, Ahmedabad</div>
            <div>Gujarat - 380 054</div>
          </div>

          <div className="space-y-1">
            <div>
              <a href="tel:9879428497" className="flex items-center gap-2">
                <LuPhone size={16} />
                <div>9879428497</div>
              </a>
            </div>
            <div>
              <a
                href="mailto:projects@establishdesigns.in"
                className="flex items-center gap-2"
              >
                <LuMail size={16} />
                <div>projects@establishdesigns.in</div>
              </a>
            </div>
          </div>

          <div>
            <div className="font-bold mb-3">Jobs & Internship</div>
            <div className="max-w-[90%]">
              For employment inquiries, please send your cover letter (addressed
              to ED Architects), CV, and work samples via email to
              hr@establishdesigns.in. Please put only your name in the subject
              line.
            </div>
          </div>
        </div>
        <div className="flex-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.681185559048!2d72.50169807477057!3d23.03547531584759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84cfdd7fb745%3A0x9c27ad6d0164d5df!2sED%20architects!5e0!3m2!1sen!2sin!4v1756742903420!5m2!1sen!2sin"
            style={{ border: "0" }}
            allowFullScreen
            className="w-full h-64 sm:h-80 lg:h-[450px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </Wrapper>
  );
};

export default ContactUs;
