import React from 'react';
import { Section, Option, SelectInput, TextInput, BooleanInput } from 'components/PropertyEditor';
import Button from 'components/Buttons/Button';

export default function ElementContainerActions(props) {
  const { onCopy, onDelete, interactionLayer, modalElementSelected } = props;

  if (interactionLayer && !modalElementSelected) return null;

  return (
    <Section title="Actions" icon="bars">
      <div>
        <Button onClick={onDelete} icon="trash-alt" red>
          Delete
        </Button>
        {!modalElementSelected && (
          <Button onClick={onCopy} icon="clone" right>
            Copy
          </Button>
        )}
      </div>
    </Section>
  );
}
