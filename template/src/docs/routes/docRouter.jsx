import { lazy } from 'react';
import paths, { rootPaths } from './docPaths';

const AppBarDoc = lazy(() => import('docs/component-docs/AppBarDoc'));
const AutocompleteDoc = lazy(() => import('docs/component-docs/AutocompleteDoc'));
const ButtonDoc = lazy(() => import('docs/component-docs/ButtonDoc'));
const ButtonGroupDoc = lazy(() => import('docs/component-docs/ButtonGroupDoc'));
const BreadcrumbsDoc = lazy(() => import('docs/component-docs/BreadcrumbsDoc'));
const CheckboxDoc = lazy(() => import('docs/component-docs/CheckboxDoc'));
const ChipDoc = lazy(() => import('docs/component-docs/ChipDoc'));
const ContainerDoc = lazy(() => import('docs/component-docs/ContainerDoc'));
const DialogDoc = lazy(() => import('docs/component-docs/DialogDoc'));
const DataGridDoc = lazy(() => import('docs/component-docs/DataGridDoc'));
const FabDoc = lazy(() => import('docs/component-docs/FabDoc'));
const LinkDoc = lazy(() => import('docs/component-docs/LinkDoc'));
const MenuDoc = lazy(() => import('docs/component-docs/MenuDoc'));
const PopoverDoc = lazy(() => import('docs/component-docs/PopoverDoc'));
const PopperDoc = lazy(() => import('docs/component-docs/PopperDoc'));
const RadioDoc = lazy(() => import('docs/component-docs/RadioDoc'));
const SelectDoc = lazy(() => import('docs/component-docs/SelectDoc'));
const SliderDoc = lazy(() => import('docs/component-docs/SliderDoc'));
const SpeedDialDoc = lazy(() => import('docs/component-docs/SpeedDialDoc'));
const StepperDoc = lazy(() => import('docs/component-docs/StepperDoc'));
const SwitchDoc = lazy(() => import('docs/component-docs/SwitchDoc'));
const TableDoc = lazy(() => import('docs/component-docs/TableDoc'));
const TextFieldDoc = lazy(() => import('docs/component-docs/TextfieldDoc'));
const GettingStarted = lazy(() => import('docs/documentation/GettingStarted'));
const Configuration = lazy(() => import('docs/documentation/Configuration'));
const FolderStructure = lazy(() => import('docs/documentation/FolderStructure'));
const Routing = lazy(() => import('docs/documentation/Routing'));
const Theming = lazy(() => import('docs/documentation/Theming'));
const IconRegistration = lazy(() => import('docs/documentation/IconRegistration'));
const Authentication = lazy(() => import('docs/documentation/Authentication'));
const ApiCalls = lazy(() => import('docs/documentation/ApiCalls'));
const Introduction = lazy(() => import('docs/documentation/Introduction'));
const TimelineDoc = lazy(() => import('docs/component-docs/TimelineDoc'));
const ToggleButtonDoc = lazy(() => import('docs/component-docs/ToggleButtonDoc'));
const TooltipDoc = lazy(() => import('docs/component-docs/TooltipDoc'));
const TransferListDoc = lazy(() => import('docs/component-docs/TransferListDoc'));
const TypographyDoc = lazy(() => import('docs/component-docs/TypographyDoc'));
const AccordionDoc = lazy(() => import('docs/component-docs/AccordionDoc'));
const AlertDoc = lazy(() => import('docs/component-docs/AlertDoc'));
const AvatarDoc = lazy(() => import('docs/component-docs/AvatarDoc'));
const BackdropDoc = lazy(() => import('docs/component-docs/BackdropDoc'));
const BadgeDoc = lazy(() => import('docs/component-docs/BadgeDoc'));
const BottomNavigationDoc = lazy(() => import('docs/component-docs/BottomNavigationDoc'));
const BoxDoc = lazy(() => import('docs/component-docs/BoxDoc'));
const CardDoc = lazy(() => import('docs/component-docs/CardDoc'));
const DividerDoc = lazy(() => import('docs/component-docs/DividerDoc'));
const DrawerDoc = lazy(() => import('docs/component-docs/DrawerDoc'));
const GridDoc = lazy(() => import('docs/component-docs/GridDoc'));
const ImageListDoc = lazy(() => import('docs/component-docs/ImageListDoc'));
const ListDoc = lazy(() => import('docs/component-docs/ListDoc'));
const ModalDoc = lazy(() => import('docs/component-docs/ModalDoc'));
const PaginationDoc = lazy(() => import('docs/component-docs/PaginationDoc'));
const PaperDoc = lazy(() => import('docs/component-docs/PaperDoc'));
const ProgressDoc = lazy(() => import('docs/component-docs/ProgressDoc'));
const RatingDoc = lazy(() => import('docs/component-docs/RatingDoc'));
const SkeletonDoc = lazy(() => import('docs/component-docs/SkeletonDoc'));
const SnackbarDoc = lazy(() => import('docs/component-docs/SnackbarDoc'));
const StackDoc = lazy(() => import('docs/component-docs/StackDoc'));
const TabsDoc = lazy(() => import('docs/component-docs/TabsDoc'));
const IconDoc = lazy(() => import('docs/component-docs/IconDoc'));
const Layouts = lazy(() => import('docs/documentation/Layouts'));
const SwiperDoc = lazy(() => import('docs/component-docs/SwiperDoc'));
const ScrollbarDoc = lazy(() => import('docs/component-docs/ScrollbarDoc'));
const EChartsDoc = lazy(() => import('docs/component-docs/echarts/EChartsDoc'));
const DateTimePickersDoc = lazy(() => import('docs/component-docs/DateTimePickersDoc'));
const DateRangePickersDoc = lazy(() => import('docs/component-docs/DateRangePickersDoc'));
const FileUploaderDoc = lazy(() => import('docs/component-docs/FileUploaderDoc'));
const LightboxDoc = lazy(() => import('docs/component-docs/LightboxDoc'));
const EditorDoc = lazy(() => import('docs/component-docs/EditorDoc'));
const Localization = lazy(() => import('docs/documentation/Localization'));
const Dependencies = lazy(() => import('docs/documentation/Dependencies'));
const EmojiPickerDoc = lazy(() => import('docs/component-docs/EmojiPickerDoc'));
const ResizableDoc = lazy(() => import('docs/component-docs/ResizableDoc'));
const Changelog = lazy(() => import('pages/changelog'));
const Migration = lazy(() => import('pages/migration'));

export const docRoutes = [
  {
    path: rootPaths.componentDocsRoot,
    children: [
      {
        path: paths.appBar,
        element: <AppBarDoc />,
      },
      {
        path: paths.autocomplete,
        element: <AutocompleteDoc />,
      },
      {
        path: paths.breadcrumbs,
        element: <BreadcrumbsDoc />,
      },
      {
        path: paths.alert,
        element: <AlertDoc />,
      },
      {
        path: paths.chip,
        element: <ChipDoc />,
      },
      {
        path: paths.button,
        element: <ButtonDoc />,
      },
      {
        path: paths.buttonGroup,
        element: <ButtonGroupDoc />,
      },
      {
        path: paths.checkbox,
        element: <CheckboxDoc />,
      },
      {
        path: paths.chip,
        element: <ChipDoc />,
      },
      {
        path: paths.container,
        element: <ContainerDoc />,
      },
      {
        path: paths.dialog,
        element: <DialogDoc />,
      },
      {
        path: paths.dataGrid,
        element: <DataGridDoc />,
      },
      {
        path: paths.dateTimePickers,
        element: <DateTimePickersDoc />,
      },
      {
        path: paths.dateRangePicker,
        element: <DateRangePickersDoc />,
      },
      {
        path: paths.editor,
        element: <EditorDoc />,
      },
      {
        path: paths.fab,
        element: <FabDoc />,
      },
      {
        path: paths.link,
        element: <LinkDoc />,
      },
      {
        path: paths.menu,
        element: <MenuDoc />,
      },
      {
        path: paths.popover,
        element: <PopoverDoc />,
      },
      {
        path: paths.popper,
        element: <PopperDoc />,
      },
      {
        path: paths.radio,
        element: <RadioDoc />,
      },
      {
        path: paths.select,
        element: <SelectDoc />,
      },
      {
        path: paths.slider,
        element: <SliderDoc />,
      },
      {
        path: paths.speedDial,
        element: <SpeedDialDoc />,
      },
      {
        path: paths.stepper,
        element: <StepperDoc />,
      },
      {
        path: paths.switch,
        element: <SwitchDoc />,
      },
      {
        path: paths.table,
        element: <TableDoc />,
      },
      {
        path: paths.textfield,
        element: <TextFieldDoc />,
      },
      {
        path: paths.timeline,
        element: <TimelineDoc />,
      },
      {
        path: paths.toggleButton,
        element: <ToggleButtonDoc />,
      },
      {
        path: paths.tooltip,
        element: <TooltipDoc />,
      },
      {
        path: paths.transferList,
        element: <TransferListDoc />,
      },
      {
        path: paths.typography,
        element: <TypographyDoc />,
      },
      {
        path: paths.badge,
        element: <BadgeDoc />,
      },
      {
        path: paths.avatar,
        element: <AvatarDoc />,
      },
      {
        path: paths.progress,
        element: <ProgressDoc />,
      },
      {
        path: paths.pagination,
        element: <PaginationDoc />,
      },
      {
        path: paths.tabs,
        element: <TabsDoc />,
      },
      {
        path: paths.accordion,
        element: <AccordionDoc />,
      },
      {
        path: paths.list,
        element: <ListDoc />,
      },
      {
        path: paths.rating,
        element: <RatingDoc />,
      },
      {
        path: paths.card,
        element: <CardDoc />,
      },
      {
        path: paths.snackbar,
        element: <SnackbarDoc />,
      },
      {
        path: paths.backdrop,
        element: <BackdropDoc />,
      },
      {
        path: paths.skeleton,
        element: <SkeletonDoc />,
      },
      {
        path: paths.divider,
        element: <DividerDoc />,
      },
      {
        path: paths.bottomNavigation,
        element: <BottomNavigationDoc />,
      },
      {
        path: paths.imageList,
        element: <ImageListDoc />,
      },
      {
        path: paths.modal,
        element: <ModalDoc />,
      },
      {
        path: paths.grid,
        element: <GridDoc />,
      },
      {
        path: paths.stack,
        element: <StackDoc />,
      },
      {
        path: paths.drawer,
        element: <DrawerDoc />,
      },
      {
        path: paths.box,
        element: <BoxDoc />,
      },
      {
        path: paths.paper,
        element: <PaperDoc />,
      },
      {
        path: paths.icon,
        element: <IconDoc />,
      },
      {
        path: paths.swiper,
        element: <SwiperDoc />,
      },
      {
        path: paths.scrollbar,
        element: <ScrollbarDoc />,
      },
      {
        path: paths.echarts,
        element: <EChartsDoc />,
      },
      {
        path: paths.fileUploader,
        element: <FileUploaderDoc />,
      },
      {
        path: paths.lightbox,
        element: <LightboxDoc />,
      },
      {
        path: paths.emojiPicker,
        element: <EmojiPickerDoc />,
      },
      {
        path: paths.resizable,
        element: <ResizableDoc />,
      },
    ],
  },
  {
    path: rootPaths.documentationRoot,
    children: [
      {
        path: paths.introduction,
        element: <Introduction />,
      },
      {
        path: paths.gettingStared,
        element: <GettingStarted />,
      },
      {
        path: paths.configuration,
        element: <Configuration />,
      },
      {
        path: paths.layouts,
        element: <Layouts />,
      },
      {
        path: paths.folderStructure,
        element: <FolderStructure />,
      },
      {
        path: paths.routing,
        element: <Routing />,
      },
      {
        path: paths.theming,
        element: <Theming />,
      },
      {
        path: paths.icons,
        element: <IconRegistration />,
      },
      {
        path: paths.localization,
        element: <Localization />,
      },
      {
        path: paths.authentication,
        element: <Authentication />,
      },
      {
        path: paths.apiCalls,
        element: <ApiCalls />,
      },
      {
        path: paths.dependencies,
        element: <Dependencies />,
      },
    ],
  },
  {
    path: paths.changelog,
    element: <Changelog />,
  },
  {
    path: paths.migration,
    element: <Migration />,
  },
];
