// app/contact/page.jsx
'use client';

import { useState } from 'react';
import FormInput from '@/components/FormInput';
import { HiOutlineUser, HiOutlineMail } from 'react-icons/hi';

export default function ContactPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <FormInput
        label="First Name"
        name="firstName"
        placeholder="First Name"
        icon={<HiOutlineUser className="w-5 h-5" />}
        helperText="Digite seu primeiro nome"
      />

      {/* Exemplo controlado */}
      <FormInput
        label="E-mail"
        name="email"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<HiOutlineMail className="w-5 h-5" />}
        required
      />

      {/* Exemplo não-controlado */}
      <FormInput
        label="Phone"
        name="phone"
        type="tel"
        placeholder="Phone"
        defaultValue=""
        helperText="Opcional"
      />
    </div>
  );
}
