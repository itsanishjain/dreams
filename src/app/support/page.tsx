export default function ContactPage() {
  return (
    <div className="mx-4 mb-40 mt-8 flex max-w-2xl flex-col antialiased md:flex-row lg:mx-auto">
      <main className="mt-6 flex min-w-0 flex-auto flex-col px-2 md:px-0">
        <h1 className="mb-6 text-3xl font-bold">Contact Us</h1>
        <div className="prose prose-lg">
          <p>
            Thank you for reaching out to us. We value your feedback and are
            committed to providing excellent service. Please use the following
            contact information to get in touch with us.
          </p>
          <h2>General Inquiries</h2>
          <p>
            For general questions or inquiries, you can contact us via email at
            [Email Address]. Our team will respond to your message as soon as
            possible.
          </p>
          <h2>Customer Support</h2>
          <p>
            If you require assistance or have specific support-related
            questions, please reach out to our customer support team at
            [Customer Support Email] or call our support hotline at [Phone
            Number].
          </p>
          <h2>Business Partnerships</h2>
          <p>
            For partnership opportunities or business inquiries, please email us
            at [Partnership Email]. We welcome collaborations and are open to
            exploring mutually beneficial partnerships.
          </p>
          <h2>Address</h2>
          <p>
            Our headquarters is located at [Address Line 1], [Address Line 2],
            [City], [State/Province], [Postal Code]. You can also visit us in
            person during our office hours.
          </p>
          <h2>Feedback</h2>
          <p>
            We value your feedback and suggestions. Feel free to share your
            thoughts with us via email or through our website&apos;s feedback
            form. Your input helps us improve our services.
          </p>
        </div>
      </main>
    </div>
  );
}
