
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center py-4">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} SGSP Admin. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;