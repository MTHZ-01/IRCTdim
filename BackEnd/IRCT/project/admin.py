from django.contrib import admin
from .models import *
from nested_inline.admin import NestedStackedInline, NestedModelAdmin


# Inline class to display ProtectionFunction within RelayType admin panel
# class BurdenPhaseVAInline(NestedStackedInline):
#     model = BurdenPhaseVA
#     extra = 0  # Add one extra empty form by default for ProtectionFunction
#     can_delete = True  # Allow delete option for ProtectionFunction
#     fk_name = "IrnA"  # Specify the ForeignKey relationship for ProtectionFunction


class IrnAInline(NestedStackedInline):
    model = IrnA
    extra = 0  # Add one extra empty form by default for ProtectionFunction
    can_delete = True  # Allow delete option for ProtectionFunction
    # inlines = [BurdenPhaseVAInline]
    fk_name = "RelayType"  # Specify the ForeignKey relationship for ProtectionFunction


class ProtectionFunctionInline(NestedStackedInline):
    model = ProtectionFunction
    extra = 0  # Add one extra empty form by default for ProtectionFunction
    can_delete = True  # Allow delete option for ProtectionFunction
    # fk_name = "RelayType"  # Specify the ForeignKey relationship for ProtectionFunction
    # inlines = [IrnAInline]


class CTClassInline(NestedStackedInline):
    model = CTClass
    extra = 0
    can_delete = True


class Cal_Acc_ToInline(NestedStackedInline):
    model = Cal_Acc_To
    extra = 0  # Add one extra empty form by default for ProtectionFunction
    can_delete = True  # Allow delete option for ProtectionFunction
    # fk_name = "RelayType"  # Specify the ForeignKey relationship for ProtectionFunction
    inlines = [CTClassInline]


# Inline class to display RelayType within Relay admin panel
class RelayTypeInline(NestedStackedInline):
    model = RelayType
    extra = 0  # Add one extra empty form by default for RelayType
    inlines = [
        Cal_Acc_ToInline,
        ProtectionFunctionInline,
        IrnAInline,
    ]  # Include ProtectionFunction inline within RelayType inline
    can_delete = True  # Allow delete option for RelayType
    fk_name = "Relay"  # Specify the ForeignKey relationship for RelayType


# Customize the Relay admin panel
class RelayTypeAdmin(NestedModelAdmin):
    inlines = [
        Cal_Acc_ToInline,
        ProtectionFunctionInline,
    ]  # Include RelayType inline (which also includes ProtectionFunction) within Relay admin panel


# Customize the Relay admin panel
class RelayAdmin(NestedModelAdmin):
    list_display = (
        "Relay_Name",
        "Manufacture",
    )  # Display Manufacture field along with Relay Name
    inlines = [
        RelayTypeInline
    ]  # Include RelayType inline (which also includes ProtectionFunction) within Relay admin panel


class StandardInlineStandardInline(NestedStackedInline):  # You can also use StackedInline
    model = Standard
    extra = 1  # Number of empty forms to display for adding new instances
    can_delete = True  # Allow delete option for RelayType
    fk_name = "ct"  # Specify the ForeignKey relationship for RelayType


class ActivationValueC6Inline(NestedStackedInline):
    model = ActivationValueC6
    fk_name = "C6"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C6Inline(NestedStackedInline):
    model = C6
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC6Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC7Inline(NestedStackedInline):
    model = ActivationValueC7
    fk_name = "C7"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C7Inline(NestedStackedInline):
    model = C7
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC7Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC8Inline(NestedStackedInline):
    model = ActivationValueC8
    fk_name = "C8"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C8Inline(NestedStackedInline):
    model = C8
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC8Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC9Inline(NestedStackedInline):
    model = ActivationValueC9
    fk_name = "C9"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C9Inline(NestedStackedInline):
    model = C9
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC9Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC10Inline(NestedStackedInline):
    model = ActivationValueC10
    fk_name = "C10"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C10Inline(NestedStackedInline):
    model = C10
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC10Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC11Inline(NestedStackedInline):
    model = ActivationValueC11
    fk_name = "C11"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C11Inline(NestedStackedInline):
    model = C11
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC11Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC12Inline(NestedStackedInline):
    model = ActivationValueC12
    fk_name = "C12"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C12Inline(NestedStackedInline):
    model = C12
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC12Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC13Inline(NestedStackedInline):
    model = ActivationValueC13
    fk_name = "C13"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C13Inline(NestedStackedInline):
    model = C13
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC13Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC14Inline(NestedStackedInline):
    model = ActivationValueC14
    fk_name = "C14"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C14Inline(NestedStackedInline):
    model = C14
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType

    inlines = [ActivationValueC14Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class ActivationValueC15Inline(NestedStackedInline):
    model = ActivationValueC15
    fk_name = "C15"  # Specify the ForeignKey relationship for RelayType
    can_delete = True  # Allow delete option for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class C15Inline(NestedStackedInline):
    model = C15
    can_delete = True  # Allow delete option for RelayType
    fk_name = "C3"  # Specify the ForeignKey relationship for RelayType
    inlines = [ActivationValueC15Inline]
    extra = 1  # Number of empty forms to display for adding new instances


class C3Inline(NestedStackedInline):  # You can also use StackedInline
    model = C3
    inlines = [
        C6Inline,
        C7Inline,
        C8Inline,
        C9Inline,
        C10Inline,
        C11Inline,
        C12Inline,
        C13Inline,
        C14Inline,
        C15Inline,
    ]
    can_delete = True  # Allow delete option for RelayType
    fk_name = "CT"  # Specify the ForeignKey relationship for RelayType

    extra = 1  # Number of empty forms to display for adding new instances


class CTAdmin(NestedModelAdmin):
    inlines = [ C3Inline]  # Attach Standard to CT admin panel


# Register the models
admin.site.register(CT, CTAdmin)
admin.site.register(Relay, RelayAdmin)  # Register Relay model with RelayAdmin
admin.site.register(Manufacture)  # Register Manufacture model
admin.site.register(
    RelayType, RelayTypeAdmin
)  # Register RelayType model (no need for a separate RelayTypeAdmin unless needed)
admin.site.register(ProtectionFunction)  # Register ProtectionFunction model
admin.site.register(WorkSpace)  # Register WorkSpace model
