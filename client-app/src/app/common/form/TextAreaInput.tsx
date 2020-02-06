import React from 'react';
import {FieldRenderProps} from 'react-final-form';
import {Form, Label, FormFieldProps} from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLTextAreaElement>, FormFieldProps {}

const TextAreaInput : React.FC<IProps> = ({
    input,
    width,
    placeholder,
    rows,
    meta: { touched, error }
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <textarea {...input} placeholder={placeholder} rows={rows} />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
};

export default TextAreaInput;