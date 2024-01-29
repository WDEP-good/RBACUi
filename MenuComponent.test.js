import { mount } from '@vue/test-utils'
import MenuComponent from '@/components/MenuComponent.vue' // 替换为实际的组件路径
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
import menuList from '@/config/menuConfig'

describe('MenuComponent', () => {
    it('renders correctly with authorized menu items', () => {
        // Mock the user store and route
        const useStore = useUserStore()
        useStore.user = ref({
            role: {
                menus: ['menu1', 'menu2'] // Replace with actual menu indexes
            },
            username: 'admin'
        })
        const route = { path: '/students' }

        const wrapper = mount(MenuComponent, {
            global: {
                provide: {
                    useStore,
                    route
                }
            },
            stubs: {
                Menu: true // Stub the Menu component if it's a child component
            }
        })

        // Check if the authorized menu items are rendered correctly
        menuList.forEach((item) => {
            if (item.index === 'menu1' || item.index === 'menu2') {
                expect(wrapper.text()).toMatch(item.label)
            } else {
                expect(wrapper.text()).not.toMatch(item.label)
            }
        })
    })
})