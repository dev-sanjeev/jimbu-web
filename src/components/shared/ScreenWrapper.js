import { jsx as _jsx } from "react/jsx-runtime";
import { useWindowSize } from '@/hooks/useWindowSize';
const WEB_SIDEBAR_BREAKPOINT = 768;
export const ScreenWrapper = ({ children }) => {
    const { width } = useWindowSize();
    const isWide = width >= WEB_SIDEBAR_BREAKPOINT;
    return (_jsx("div", { className: `flex-1 flex flex-col overflow-hidden min-h-0${isWide ? '' : ' px-6'}`, children: children }));
};
export default ScreenWrapper;
