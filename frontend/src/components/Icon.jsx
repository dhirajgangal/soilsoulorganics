/**
 * Outline icons from react-icons/ai (Ant Design).
 * Pages pass a short name, so an icon can be swapped here in one place.
 * Ant Design has no plant icons, so the pack marks use the closest match.
 */
import {
  AiOutlineAppstore,
  AiOutlineApartment,
  AiOutlineArrowRight,
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineEnvironment,
  AiOutlineExperiment,
  AiOutlineGold,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineInbox,
  AiOutlineInstagram,
  AiOutlineLeft,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineMessage,
  AiOutlinePhone,
  AiOutlineRight,
  AiOutlineRise,
  AiOutlineShopping,
  AiOutlineSun,
  AiOutlineUser,
  AiOutlineWhatsApp,
} from "react-icons/ai";

const ICONS = {
  user: AiOutlineUser,
  bag: AiOutlineShopping,
  box: AiOutlineInbox,
  heart: AiOutlineHeart,
  pin: AiOutlineEnvironment,
  home: AiOutlineHome,
  logout: AiOutlineLogout,
  chevronLeft: AiOutlineLeft,
  chevronRight: AiOutlineRight,
  arrow: AiOutlineArrowRight,
  check: AiOutlineCheck,
  chat: AiOutlineMessage,
  mail: AiOutlineMail,
  phone: AiOutlinePhone,
  whatsapp: AiOutlineWhatsApp,
  instagram: AiOutlineInstagram,
  // Pack marks
  leaf: AiOutlineCheckCircle,
  sprout: AiOutlineRise,
  roots: AiOutlineApartment,
  layers: AiOutlineGold,
  drop: AiOutlineExperiment,
  sun: AiOutlineSun,
  wheat: AiOutlineAppstore,
};

export default function Icon({ name }) {
  const Glyph = ICONS[name] || AiOutlineCheck;
  return <Glyph className="icon" aria-hidden="true" focusable="false" />;
}
