import './FormGroup.css';

interface FormGroupProps {
    title: string;
    iconClass: string;
    children?: React.ReactNode;
}

const FormGroup = ({
    title,
    iconClass,
    children
}: FormGroupProps) => {
    return (
        <div className="form-group">
            <label><i className={iconClass}></i> {title}</label>
            {children}
        </div>
    )
};

export default FormGroup;