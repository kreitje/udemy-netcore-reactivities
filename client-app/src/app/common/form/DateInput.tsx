import React from 'react';

import {FieldRenderProps} from 'react-final-form';
import {Form, Label, FormFieldProps} from 'semantic-ui-react';
import {DateTimePicker} from 'react-widgets';

interface IProps extends FieldRenderProps<Date, HTMLInputElement>, FormFieldProps {}

const DateInput : React.FC<IProps> = ({
  input,
  width,
  placeholder,
  date = false, 
  time = false,
  meta: { touched, error }
}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker 
                placeholder={placeholder}
                value={input.value || null}
                date={date}
                time={time}
                onChange={input.onChange}
                onBlur={input.onBlur}
                onKeyDown={(e) => e.preventDefault()}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
};

export default DateInput;