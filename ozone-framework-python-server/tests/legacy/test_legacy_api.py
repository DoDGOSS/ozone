from django.conf import settings
from django.test import TestCase
from rest_framework.test import APIClient

requests = APIClient()


def login_as_admin():
    requests.login(email='admin@goss.com', password='password')


class TestingLegacyApi(TestCase):
    fixtures = ['resources/fixtures/default_data.json', ]

    def test_person_whoami(self):
        login_as_admin()
        response = requests.get('/person/whoami/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'admin@goss.com')

    def test_person_whoami_unauthenticated(self):
        response = requests.get('/person/whoami/')
        self.assertEqual(response.status_code, 403)

    def test_prefs_has_preference(self):
        login_as_admin()
        response = requests.get('/prefs/hasPreference/owf.admin.UserEditCopy/guide_to_launch/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['preferenceExist'], True)
        self.assertEqual(response.data['statusCode'], 200)

    def test_prefs_has_preference_false(self):
        login_as_admin()
        response = requests.get('/prefs/hasPreference/fake/fake/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['preferenceExist'], False)
        self.assertEqual(response.data['statusCode'], 200)

    def test_prefs_has_preference_unauthenticated(self):
        response = requests.get('/prefs/hasPreference/namespace/path/')
        self.assertEqual(response.status_code, 403)

    def test_prefs_preference_get(self):
        login_as_admin()
        response = requests.get('/prefs/preference/owf.admin.UserEditCopy/guide_to_launch/')
        self.assertTrue(response.status_code, 200)

    def test_prefs_preference_get_does_not_exist(self):
        login_as_admin()
        response = requests.get('/prefs/preference/no/no/')
        self.assertTrue(response.status_code, 200)
        self.assertEqual(response.data['success'], True)
        self.assertEqual(response.data['preference'], None)

    def test_prefs_preference_get_unauthenticated(self):
        response = requests.get('/prefs/preference/namespace/path/')
        self.assertEqual(response.status_code, 403)

    def test_prefs_preference_post(self):
        login_as_admin()
        response = requests.post(
            '/prefs/preference/new_namespace/new_path/',
            'value=the_value',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertTrue(response.status_code, 200)

    def test_prefs_preference_post_exists(self):
        login_as_admin()
        response = requests.post(
            '/prefs/preference/owf.admin.UserEditCopy/guide_to_launch/',
            'value=new_value',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertTrue(response.status_code, 200)
        self.assertEqual(response.data['value'], 'new_value')

    def test_prefs_preference_post_unauthenticated(self):
        response = requests.post('/prefs/preference/namespace/path/')
        self.assertEqual(response.status_code, 403)

    def test_prefs_preference_put(self):
        login_as_admin()
        response = requests.put(
            '/prefs/preference/owf.admin.UserEditCopy/guide_to_launch/',
            'value=new_value',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertTrue(response.status_code, 200)
        self.assertEqual(response.data['value'], 'new_value')

    def test_prefs_preference_put_new(self):
        login_as_admin()
        response = requests.put(
            '/prefs/preference/new_namespace/new_path/',
            'value=the_value',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertTrue(response.status_code, 200)

    def test_prefs_preference_put_unauthenticated(self):
        response = requests.put('/prefs/preference/namespace/path/')
        self.assertEqual(response.status_code, 403)

    def test_prefs_server_resources(self):
        login_as_admin()
        response = requests.get('/prefs/server/resources/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['serverVersion'], settings.SYSTEM_VERSION)

    def test_prefs_server_resources_unauthenticated(self):
        response = requests.get('/prefs/server/resources/')
        self.assertEqual(response.status_code, 403)

    def test_prefs_widget_list_user_and_group(self):
        login_as_admin()
        response = requests.post(
            '/prefs/widget/listUserAndGroupWidgets',
            '_method=GET&widgetVersion=1.0',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertEqual(response.status_code, 200)

    def test_prefs_widget_list_user_and_group_post_fails(self):
        login_as_admin()
        response = requests.post(
            '/prefs/widget/listUserAndGroupWidgets',
            'widgetVersion=1.0',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertEqual(response.status_code, 405)

    def test_prefs_widget_list_user_and_group_unauthenticated(self):
        response = requests.get('/prefs/widget/listUserAndGroupWidgets')
        self.assertEqual(response.status_code, 401)

    def test_prefs_widget_list_user_and_group(self):
        login_as_admin()
        response = requests.post(
            '/prefs/widget/listUserAndGroupWidgets',
            '_method=GET&widgetVersion=1.0',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertEqual(response.status_code, 200)

    def test_prefs_widget_list_user_and_group_post_fails(self):
        login_as_admin()
        response = requests.post(
            '/prefs/widget/listUserAndGroupWidgets',
            'widgetVersion=1.0',
            content_type='application/x-www-form-urlencoded'
        )
        self.assertEqual(response.status_code, 405)

    def test_prefs_widget_list_user_and_group_unauthenticated(self):
        response = requests.get('/prefs/widget/listUserAndGroupWidgets')
        self.assertEqual(response.status_code, 401)
