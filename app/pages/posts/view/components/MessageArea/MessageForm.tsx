import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './messageForm.module.scss';
import { toast } from 'react-toastify';
import { toastMessages } from '@/utils/toastMessage';
import APIClient from '@/utils/apiClient';

interface MessageFormProps {
  authEmail: string;
}

type fieldNameType = 'name' | 'message' | 'email' | 'phone';

const MessageForm: React.FC<MessageFormProps> = ({ authEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
  });

  const [messageSent, setMessageSent] = useState(false);

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'name':
        if (value.length < 2 || value.length > 50) {
          return '姓名长度必须在 2 到 50 个字符之间';
        }
        break;
      case 'message':
        if (value.length < 6 || value.length > 500) {
          return '内容长度必须在 6 到 500 个字符之间';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return '请输入有效的邮箱地址';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isValid = true;
    const newErrors = { ...errors };
    for (const field in formData) {
      const error = validateField(field, formData[field as fieldNameType]);
      newErrors[field as fieldNameType] = error;
      if (error) {
        isValid = false;
      }
    }
    setErrors(newErrors);

    if (isValid) {
      const { name, message, email, phone } = formData;

      const sendMessage = async () => {
        try {
          const client = new APIClient();

          const response = await client.post('message/send', {
            subject: `来自${name}的消息`,
            content:
              message + '\n url: ' + window.location.href + ', phone:' + phone,
            fromEmail: email,
            toEmail: authEmail,
          });

          if (response.message) {
            setMessageSent(true);
            return '信息发送成功！';
          } else {
            console.error('发送失败');
            throw new Error('发送失败');
          }
        } catch (error) {
          console.error('发送出错：', error);
          throw error;
        }
      };

      await toast.promise(
        sendMessage(),
        {
          success: toastMessages.SEND_MESSAGE_SUCCESS,
          pending: toastMessages.SEND_MESSAGE_LOADING,
          error: toastMessages.SEND_MESSAGE_ERROR,
        },
        { position: 'top-center' }
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={styles.messageForm}>
      <p className={styles.formDescription}>(๑˃̵ᴗ˂̵)و 有想法？可以联系作者！</p>

      <Form.Group controlId="formName">
        <Form.Control
          type="text"
          name="name"
          placeholder="您的姓名"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleChange}
          isInvalid={!!errors.name}
          className={styles.formInput}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Control
          type="email"
          name="email"
          placeholder="您的邮箱"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleChange}
          isInvalid={!!errors.email}
          className={styles.formInput}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formPhone">
        <Form.Control
          type="text"
          name="phone"
          placeholder="您的手机号"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleChange}
          isInvalid={!!errors.phone}
          className={styles.formInput}
        />
        <Form.Control.Feedback type="invalid">
          {errors.phone}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formMessage">
        <Form.Control
          as="textarea"
          name="message"
          placeholder="留言内容"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleChange}
          isInvalid={!!errors.message}
          className={styles.textArea}
        />
        <Form.Control.Feedback type="invalid">
          {errors.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className={styles.submitButton}
        disabled={!!Object.values(errors).filter(Boolean).length || messageSent}
      >
        提交
      </Button>
    </Form>
  );
};

export default MessageForm;
