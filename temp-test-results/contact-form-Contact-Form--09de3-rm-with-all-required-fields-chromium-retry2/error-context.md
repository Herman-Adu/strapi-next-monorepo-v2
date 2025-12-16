# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - img [ref=e6]
      - generic [ref=e8]:
        - heading "Page not found" [level=2] [ref=e9]
        - paragraph [ref=e10]: The page you are looking for was not found.
      - paragraph [ref=e11]: Please check if you have entered the correct URL or return to the home page.
      - link "Go to home page" [ref=e12] [cursor=pointer]:
        - /url: /
    - generic [ref=e14]: xl
    - region "Notifications (F8)":
      - list
  - generic [ref=e19] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e20]:
      - img [ref=e21]
    - generic [ref=e24]:
      - button "Open issues overlay" [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]: "3"
          - generic [ref=e28]: "4"
        - generic [ref=e29]:
          - text: Issue
          - generic [ref=e30]: s
      - button "Collapse issues badge" [ref=e31]:
        - img [ref=e32]
  - alert [ref=e34]
```