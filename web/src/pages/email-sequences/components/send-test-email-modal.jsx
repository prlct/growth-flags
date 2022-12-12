import { TextInput, Button, Group } from '@mantine/core';

const SendTestEmailModal = ({ context, id, innerProps }) => {
  const { email } = innerProps;

  return (
    <>
      <TextInput label="Your email address" mt={16} />
      <Group position="apart" mt={16}>
        <Button variant="subtle" onClick={() => context.closeModal('sendTestEmail')}>Cancel</Button>
        <Button>Send</Button>
      </Group>
    </>
  );
};

export default SendTestEmailModal;
