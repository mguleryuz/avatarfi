import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Wrap,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { phoneRegExp } from '@/utils'
import { handleSignup } from '@/lib'
import { AvatarSpinner } from '@/components'

export default function Signup() {
  const dispatch = useDispatch()
  const router = useRouter()
  const auth = useSelector((state: RootState) => state.auth)
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      surname: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Email is required!')
        .email(`Must be a valid email`),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid!'),
      password: Yup.string()
        .required('Password is required!')
        .test(
          'len',
          'Must be more then 5 characters',
          (val) => !!val && val.length > 5
        ),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), undefined],
        'Passwords must match!'
      ),
    }),
    onSubmit: (values, actions) => {
      const { setSubmitting, setFieldError } = actions
      handleSignup({ values, setFieldError, setSubmitting, dispatch, router })
    },
  })

  useEffect(() => {
    if (auth.id) {
      router.push('/')
    }
  }, [auth.id, router])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Wrap justify={'center'} maxW={600} spacing={3}>
          <FormControl
            maxW={250}
            isInvalid={formik.touched.email && !!formik.errors.email}
          >
            <FormLabel htmlFor="email">E-mail*</FormLabel>
            <InputGroup>
              <Input
                name="email"
                type="email"
                placeholder="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl
            maxW={250}
            isInvalid={formik.touched.password && !!formik.errors.password}
          >
            <FormLabel htmlFor="password">Password*</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type="password"
                placeholder="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl
            maxW={250}
            isInvalid={
              formik.touched.confirmPassword && !!formik.errors.confirmPassword
            }
          >
            <FormLabel htmlFor="password">Confirm Password*</FormLabel>
            <InputGroup>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
          </FormControl>
          <FormControl maxW={250}>
            <FormLabel htmlFor="name">Name ( optional )</FormLabel>
            <InputGroup>
              <Input
                name="name"
                type="text"
                placeholder="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </InputGroup>
          </FormControl>
          <FormControl maxW={250}>
            <FormLabel htmlFor="name">Surname ( optional )</FormLabel>
            <InputGroup>
              <Input
                name="surname"
                type="text"
                placeholder="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
              />
            </InputGroup>
          </FormControl>
          <FormControl
            maxW={250}
            isInvalid={formik.touched.phone && !!formik.errors.phone}
          >
            <FormLabel htmlFor="name">Phone Number ( optional )</FormLabel>
            <InputGroup>
              <Input
                name="phone"
                type="tel"
                placeholder="phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </InputGroup>
            <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
          </FormControl>
          <Button
            w={250}
            colorScheme="twitter"
            size="sm"
            type="submit"
            spinner={<AvatarSpinner />}
            isLoading={formik.isSubmitting}
          >
            Signup
          </Button>
        </Wrap>
      </form>
    </>
  )
}
