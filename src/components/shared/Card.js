import { jsx as _jsx } from "react/jsx-runtime";
const baseClasses = 'bg-card rounded-lg border border-border shadow-card';
export const Card = ({ children, className, onPress }) => {
    const classes = className ? `${baseClasses} ${className}` : baseClasses;
    if (onPress) {
        return (_jsx("div", { className: `${classes} cursor-pointer`, onClick: onPress, children: children }));
    }
    return _jsx("div", { className: classes, children: children });
};
export default Card;
