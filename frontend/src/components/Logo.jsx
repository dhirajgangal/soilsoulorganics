/**
 * Brand logo.
 *
 * The file is a square with empty space around the mark. The frame
 * crops that empty space. The artwork itself is unchanged.
 */
import logo from "../assets/logo.png";

export default function Logo({ size = "header", alt = "Soil Soul" }) {
  return (
    <span className={`logo-frame logo-${size}`}>
      <img src={logo} alt={alt} />
    </span>
  );
}
