import React from 'react';

// Composant pour chaque question/réponse dans l'accordéon
const AccordionItem = ({ id, question, answer, delay }) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`flush-heading${id}`}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#flush-collapse${id}`}
          aria-expanded="false"
          aria-controls={`flush-collapse${id}`}
        >
          {question}
        </button>
      </h2>
      <div
        id={`flush-collapse${id}`}
        className="accordion-collapse collapse"
        aria-labelledby={`flush-heading${id}`}
        data-bs-parent="#accordionFlushSection"
        data-wow-delay={delay}
      >
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  );
};

function FAQ() {
  return (
    <div>
      {/* FAQs Start */}
      <div className="container-fluid faq-section pb-5">
        <div className="container pb-5 overflow-hidden">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s">
            <h4 className="text-primary">FAQs</h4>
            <h1 className="display-5 mb-4">Frequently Asked Questions</h1>
            <p className="mb-0">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur adipisci facilis cupiditate recusandae aperiam
              temporibus corporis itaque quis facere, numquam, ad culpa deserunt sint dolorem autem obcaecati, ipsam mollitia hic.
            </p>
          </div>
          <div className="row g-5 align-items-center">
            {/* FAQ Accordion */}
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.2s">
              <div className="accordion accordion-flush bg-light rounded p-5" id="accordionFlushSection">
                <AccordionItem
                  id={1}
                  question="What Does This Tool Do?"
                  answer="Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the first item's accordion body."
                  delay="0.2s"
                />
                <AccordionItem
                  id={2}
                  question="What Are The Disadvantages Of Online Trading?"
                  answer="Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the second item's accordion body. Let's imagine this being filled with some actual content."
                  delay="0.4s"
                />
                <AccordionItem
                  id={3}
                  question="Is Online Trading Safe?"
                  answer="Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the third item's accordion body."
                  delay="0.6s"
                />
                <AccordionItem
                  id={4}
                  question="What Is Online Trading, And How Does It Work?"
                  answer="Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the fourth item's accordion body."
                  delay="0.8s"
                />
                <AccordionItem
                  id={5}
                  question="Which App Is Best For Online Trading?"
                  answer="Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the fifth item's accordion body."
                  delay="1s"
                />
                <AccordionItem
                  id={6}
                  question="How To Create A Trading Account?"
                  answer="Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the sixth item's accordion body."
                  delay="1.2s"
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
              <div className="bg-primary rounded">
                <img src="assets/img/about-2.png" className="img-fluid w-100" alt="FAQ Illustration" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQs End */}
    </div>
  );
}

export default FAQ;
